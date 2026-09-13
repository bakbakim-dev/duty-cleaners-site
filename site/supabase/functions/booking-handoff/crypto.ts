const encoder = new TextEncoder();
const context = encoder.encode("duty-cleaners:booking-handoff:v1");
export const TTL_MS = 20 * 60 * 1000;
export const PRIVATE_KEYS = ["f_name", "l_name", "email", "phone", "dc_entry", "dc_clean", "dc_park", "dc_flex", "dc_notes", "dc_addr", "dc_apt", "dc_city", "dc_prov", "dc_zip"] as const;

export function validateFields(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("invalid");
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!(PRIVATE_KEYS as readonly string[]).includes(key) || typeof value !== "string" || value.length > (key === "dc_notes" ? 500 : 120)) throw new Error("invalid");
    fields[key] = value;
  }
  if (!Object.keys(fields).length) throw new Error("invalid");
  return fields;
}
const base64url = (data: Uint8Array) => btoa(String.fromCharCode(...data)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const decode = (value: string) => Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
async function keyFor(secret: string) {
  if (secret.length < 32) throw new Error("unconfigured");
  const key = await crypto.subtle.digest("SHA-256", encoder.encode(`duty-cleaners-handoff:${secret}`));
  return crypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function seal(fields: unknown, secret: string, now = Date.now()): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const payload = encoder.encode(JSON.stringify({ v: 1, issued: now, expires: now + TTL_MS, fields: validateFields(fields) }));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: context }, await keyFor(secret), payload);
  return `${base64url(iv)}.${base64url(new Uint8Array(encrypted))}`;
}
export async function unseal(token: string, secret: string, now = Date.now()): Promise<Record<string, string>> {
  if (!/^[\w-]{16}\.[\w-]{32,10000}$/.test(token)) throw new Error("invalid");
  const [iv, ciphertext] = token.split(".");
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decode(iv), additionalData: context }, await keyFor(secret), decode(ciphertext));
  const payload = JSON.parse(new TextDecoder().decode(plaintext));
  if (payload.v !== 1 || !Number.isFinite(payload.issued) || payload.issued > now + 60_000 || payload.expires !== payload.issued + TTL_MS || payload.expires <= now) throw new Error("expired");
  return validateFields(payload.fields);
}
