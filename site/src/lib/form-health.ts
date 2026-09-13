/**
 * Privacy-safe operational reporting for every customer-facing form.
 *
 * Never pass form values here. The endpoint accepts only the fixed labels in
 * these types plus the current pathname, so a failure alert cannot leak a
 * customer's name, contact details, address, message or access instructions.
 */

export type MonitoredForm =
  | "quote-funnel"
  | "contact-form"
  | "careers-application"
  | "booking-handoff";

export type FormStage =
  | "lead"
  | "confirmation"
  | "callback"
  | "secure-transfer"
  | "ghl-delivery"
  | "durable-capture"
  | "form-submit";

export type FailureCategory =
  | "network"
  | "timeout"
  | "http"
  | "invalid-response"
  | "storage"
  | "delivery"
  | "configuration";

interface FailureDetails {
  form: MonitoredForm;
  stage: FormStage;
  category: FailureCategory;
  status?: number;
}

const endpoint = (import.meta.env.VITE_FORM_HEALTH_ENDPOINT as string | undefined)?.trim()
  || "/api/form-health.php";
const failedIncidents = new Set<string>();

const incidentKey = ({ form, stage }: Pick<FailureDetails, "form" | "stage">) => `${form}:${stage}`;

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  // Deliberately omit search and hash: they can carry campaign identifiers or
  // BookingKoala handoff fields and are not needed to diagnose a form outage.
  return window.location.pathname.slice(0, 300) || "/";
}

function send(event: "failed" | "recovered", details: FailureDetails): void {
  if (typeof fetch !== "function") return;
  const status = Number.isInteger(details.status) && details.status! >= 0 && details.status! <= 599
    ? details.status
    : 0;
  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    cache: "no-store",
    keepalive: true,
    body: JSON.stringify({
      event,
      form: details.form,
      stage: details.stage,
      category: details.category,
      status,
      path: currentPath(),
    }),
  }).catch(() => {
    // Monitoring must never interrupt the customer's form or create a second
    // customer-facing error when the monitoring endpoint itself is offline.
  });
}

export function reportFormFailure(details: FailureDetails): void {
  failedIncidents.add(incidentKey(details));
  send("failed", details);
}

export function reportFormRecovery(details: FailureDetails): void {
  const key = incidentKey(details);
  if (!failedIncidents.delete(key)) return;
  send("recovered", details);
}

export function monitoredFormForSource(source: unknown): MonitoredForm {
  const value = typeof source === "string" ? source : "";
  if (value.startsWith("contact-form")) return "contact-form";
  if (value.startsWith("careers-application")) return "careers-application";
  return "quote-funnel";
}
