import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FrequencyChips from "@/components/quote/FrequencyChips";
import PricePanel from "@/components/quote/PricePanel";
import RiskReversalRow from "@/components/quote/RiskReversalRow";
import StepHeader, { Callout, StepFooter } from "@/components/quote/StepHeader";
import {
  DEFAULT_FREQUENCY,
  FREQUENCIES,
  SELECTABLE_SERVICES,
  DEEP_CLEAN_ADDON_ID,
  addOnsFor,
  deepCleanFromPrice,
  bathroomOptions,
  bedroomOptions,
  calculateQuote,
  formatPrice,
  withGst,
  getFrequency,
  getService,
  halfBathOptions,
  homeTypeOptions,
  type FrequencyId,
  type ServiceId,
} from "@/data/pricing";
import {
  GHL_FREQUENCY_LABELS,
  GHL_HOME_TYPE_LABELS,
  GHL_SERVICE_LABELS,
  ghlBathroomLabel,
  ghlBedroomLabel,
  ghlHalfBathLabel,
} from "@/config/ghl";
import { Helmet } from "react-helmet-async";

import BookingHandoff, {
  clearHandoffFlag,
  handoffAlreadyFired,
  markHandoffFired,
} from "@/components/quote/BookingHandoff";
import BookingEmbed from "@/components/quote/BookingEmbed";
import {
  BOOKING_MODE,
  BOOKING_ORIGIN,
  shelfExtrasFor,
  petsExtraForSelection,
  travelFeeExtraForSelection,
  buildBookingQuery,
  groupExtras,
  benefitForExtra,
  extraDisplayName,
  DC_NOTES_MAX,
  postalCodeCityStatus,
  postalCodeCityName,
  normalizePostalCode,

  type CleanerDetails,
  type DcEntry,
  type DcParking,
  type ResolvedExtra,
} from "@/lib/booking-redirect";
import { RESPONSE_TIME_PROMISE, SUPPORT_EMAIL, cityProofFor } from "@/data/proof";
import { submitQuote, type QuotePayload } from "@/lib/quote-submit";
import { captureTrackingParams } from "@/lib/tracking";
import { setQuoteStep } from "@/lib/quote-progress";

import { Link, useLocation, useNavigate } from "react-router-dom";

const STEP_LABELS = [
  "About your home",
  "Your details",
  "Your price",
  "Pick your time",
];

/**
 * Quantity extras price per unit — BookingKoala names carry the unit, so the
 * suffix is read off the name rather than keyed to an id that can change.
 */
const unitSuffixFor = (name: string): string => {
  const value = name.toLowerCase();
  if (value.includes("per set") || value.includes("blinds")) return "/set";
  if (value.includes("per hour") || value.includes("hour")) return "/hr";
  return "";
};

/** "Details for your cleaner" — chip values match the dc_* URL contract. */
const DC_ENTRY_OPTIONS: { value: DcEntry; label: string }[] = [
  { value: "home", label: "Someone will be home" },
  // Was "Key in mailbox" — the same idea as the key under the mat this audit
  // took off five pages, and a community mailbox is Canada Post property.
  { value: "mailbox", label: "Key in a lockbox" },
  { value: "code", label: "Access code" },
  { value: "other", label: "Other" },
];

const DC_PARKING_OPTIONS: { value: DcParking; label: string }[] = [
  { value: "street", label: "Street" },
  { value: "visitor", label: "Visitor" },
  { value: "driveway", label: "Driveway" },
  { value: "paid", label: "Paid nearby" },
];

/* Same dc_clean 1-5 scale, asked as a question people can actually answer:
   "when was it last cleaned" instead of a self-rated 1-5 condition score. */
const DC_CLEANLINESS_OPTIONS = [
  { value: 1, label: "Within 2 weeks" },
  { value: 2, label: "A few weeks ago" },
  { value: 3, label: "A few months ago" },
  { value: 4, label: "6+ months ago" },
  { value: 5, label: "Never professionally" },
];

const DC_CLEANLINESS_LABELS: Record<number, string> = Object.fromEntries(
  DC_CLEANLINESS_OPTIONS.map((option) => [option.value, option.label]),
);

const DC_ENTRY_LABELS: Record<DcEntry, string> = Object.fromEntries(
  DC_ENTRY_OPTIONS.map((option) => [option.value, option.label])
) as Record<DcEntry, string>;

const DC_PARKING_LABELS: Record<DcParking, string> = Object.fromEntries(
  DC_PARKING_OPTIONS.map((option) => [option.value, option.label])
) as Record<DcParking, string>;




/** Types as "T5J 0N3": uppercase, one space after the third character. */
const formatPostalInput = (value: string) => {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
};



/** Step 4 happens on the BookingKoala page, but it is part of the same funnel. */
const TOTAL_STEPS = STEP_LABELS.length;

/** Minimum plausible time a human needs to complete the funnel. */
const MIN_FILL_MS = 4000;

/**
 * Native three-step quote flow.
 *
 *   1. About your home  — no contact fields, no price shown yet
 *   2. Contact details  — gated: the price only appears on a real 2xx
 *   3. Price + extras   — live price updates, then the booking request
 *
 * Every option and price rendered here comes from the BookingKoala config
 * snapshot (`src/data/bk-config.json`) so the site can never quote a number
 * BookingKoala would not.
 */

/**
 * Tappable number chips replacing the old dropdowns for home size. Every chip
 * clears the 44px touch target and the group is a radiogroup for AT.
 */
function NumberChips({
  legend,
  options,
  value,
  onChange,
  name,
  caption = false,
}: {
  legend: string;
  options: { id: number; value: number; label: string }[];
  value: number;
  onChange: (next: number) => void;
  name: string;
  /** Show the full label (with the sqft cap) under the selected chip. */
  caption?: boolean;
}) {
  const selected = options.find((option) => option.value === value);
  /* "3 Bedrooms (Under 1700sqft)" → "3 Bedrooms · under 1,700 sqft" */
  const captionText = selected
    ? selected.label
        .replace(/\s*\((.+)\)\s*$/, (_, inner: string) => ` · ${inner}`)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        .replace(/sqft/i, " sqft")
        .replace(/Under/, "under")
        .replace(/\s+/g, " ")
        .trim()
    : null;

  return (
    <fieldset>
      <legend className="text-base font-semibold text-foreground">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
        {options.map((option) => {
          const active = option.value === value;
          /* "3 Bedrooms (Under 1700sqft)" → big "3"; the sqft cap moves to the
             caption under the row when one is requested. */
          const match = option.label.match(/^(\d+)\D*(?:\((.+)\))?/);
          const head = match ? match[1] : option.label;
          const sub = caption ? undefined : match?.[2];
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(option.value)}
              aria-label={option.label}
              className={`min-h-[48px] min-w-[56px] rounded-sm border px-3 py-1.5 text-lg font-bold transition-colors ${
                active
                  ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                  : "border-border bg-card text-foreground hover:border-brand-navy/50 hover:bg-muted"
              }`}
            >
              <span className="block leading-tight">{head}</span>
              {sub && (
                <span className={`block text-[11px] font-medium leading-tight ${active ? "text-brand-navy-foreground/75" : "text-muted-foreground"}`}>
                  {sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {caption && captionText && (
        <p aria-live="polite" className="mt-2 text-sm font-semibold text-foreground">
          {captionText}
        </p>
      )}
    </fieldset>
  );
}


export default function QuoteFlow({
  initialService = "standard",
  initialIntent = null,
  servicePreset = false,
  onClose,
}: {
  initialService?: ServiceId;
  /** "deep" when the visitor entered through a Deep Cleaning CTA. */
  initialIntent?: "deep" | null;
  /** The CTA already chose the service — don't ask the same question twice. */
  servicePreset?: boolean;
  onClose?: () => void;
}) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const proof = cityProofFor(pathname);

  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceId>(initialService);
  /**
   * Deep-clean intent: the visitor either entered through a Deep Cleaning CTA
   * (?intent=deep / data-quote-intent) or tapped the banner. It never invents a
   * service — it only changes copy, the line-item display and the GHL payload.
   */
  const [deepCleanIntent, setDeepCleanIntent] = useState(
    initialIntent === "deep" || new URLSearchParams(search).get("intent") === "deep"
  );
  /**
   * A campaign coupon rides in on ?promo=CODE and is passed straight through
   * to BookingKoala, which validates it. We never discount our own display
   * price off a code we cannot verify.
   */
  const promoCode = new URLSearchParams(search).get("promo")?.trim() || undefined;

  const [homeType, setHomeType] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [halfBaths, setHalfBaths] = useState(0);
  const [frequency, setFrequency] = useState<FrequencyId>(DEFAULT_FREQUENCY);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  /** Focus lands on the new step's heading so SR users hear where they are. */
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRenderRef = useRef(true);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [handingOff, setHandingOff] = useState(false);
  /**
   * The add-on basket: BookingKoala extra name → quantity. Keyed by name, not
   * id, because the id is size-specific — it is resolved at handoff from the
   * very row whose price the customer was shown. Empty by default.
   */
  const [addOns, setAddOns] = useState<Record<string, number>>({});
  
  const [hasPets, setHasPets] = useState<boolean | null>(null);
  /**
   * "Is the address inside city limits?" — only asked as a fallback when the
   * postal code can't answer it. Unanswered is priced as inside (no fee) so
   * the CTA is never blocked; only an explicit "No" adds the travel fee.
   */
  const [insideCity, setInsideCity] = useState<boolean | null>(null);
  /** Optional answers that pre-fill the booking page's own questions. */
  const [details, setDetails] = useState<CleanerDetails>({});
  /** The condition nudge is advice, so it can be dismissed for good. */
  const [deepNudgeDismissed, setDeepNudgeDismissed] = useState(false);
  /**
   * The postal code decides the travel fee whenever it's complete; the manual
   * radio is the fallback only while it can't.
   */
  const cityStatus = postalCodeCityStatus(details.postalCode);
  const outsideCity =
    cityStatus === "unknown" ? insideCity === false : cityStatus === "outside";

  const startedAtRef = useRef(Date.now());
  /**
   * When the hero card already chose the service, step 1 opens with that shown
   * as a collapsed chip instead of re-asking. Expanded on request.
   */
  const [serviceExpanded, setServiceExpanded] = useState(!servicePreset);
  /** Section "peek": the next question is scrolled just into view. */
  const homeSizeRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  /** The step-3 primary CTA — the sticky bar hides while it is on screen. */
  const ctaRef = useRef<HTMLDivElement>(null);
  /**
   * BookingKoala cannot confirm a clean without entry, parking, condition and
   * a postal code, so the funnel collects them rather than calling them
   * optional and letting the visitor hit a wall at checkout.
   */
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  /**
   * Step 3 is two focused panes rather than one very tall page: "price" (the
   * number, how often, add-ons) and "details" (what BookingKoala must know
   * before it can confirm). The price itself stays visible in the sidebar and
   * the sticky bar, so nothing is lost by splitting them.
   */
  const [pricePane, setPricePane] = useState<"price" | "details">("price");
  const [ctaVisible, setCtaVisible] = useState(true);

  /** Bring the next question just into view without yanking the page. */
  const peek = (ref: React.RefObject<HTMLElement>) => {
    window.requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  useEffect(() => {
    setService(initialService);
  }, [initialService]);

  useEffect(() => {
    setServiceExpanded(!servicePreset);
  }, [servicePreset]);

  // Re-opening the overlay from a deep CTA re-arms the intent.
  useEffect(() => {
    if (initialIntent === "deep") setDeepCleanIntent(true);
  }, [initialIntent]);

  useEffect(() => {
    captureTrackingParams();
  }, []);

  // Share progress with the page-level floating CTA so it can nudge the
  // visitor back into an unfinished quote instead of repeating itself.
  useEffect(() => {
    setQuoteStep(step);
    if (step !== 2) setPricePane("price");
  }, [step]);

  // Announce the step change. Skipped on first mount so opening the page
  // doesn't yank focus away from wherever the visitor already is.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    stepHeadingRef.current?.focus();
  }, [step]);


  // Back from BookingKoala must land on the quote, never on the interstitial
  // (which would fling the visitor straight back out). Covers both a fresh
  // load and a bfcache restore, then disarms so a second, deliberate click
  // still hands off normally.
  useEffect(() => {
    if (handoffAlreadyFired()) {
      setHandingOff(false);
      clearHandoffFlag();
    }
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setHandingOff(false);
      clearHandoffFlag();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const selected = getService(service);

  const homeTypes = useMemo(() => homeTypeOptions(service), [service]);
  const beds = useMemo(() => bedroomOptions(service), [service]);
  const baths = useMemo(() => bathroomOptions(service), [service]);
  const halves = useMemo(() => halfBathOptions(service), [service]);

  // Keep the selections valid whenever the service (and therefore the
  // BookingKoala option set) changes.
  useEffect(() => {
    if (!selected.supportsRecurring) setFrequency("one-time");
  }, [selected.supportsRecurring]);

  useEffect(() => {
    setHomeType((current) =>
      homeTypes.some((option) => option.id === current) ? current : homeTypes[0]?.id ?? null
    );
  }, [homeTypes]);

  useEffect(() => {
    setBedrooms((current) =>
      beds.some((option) => option.value === current) ? current : beds[0]?.value ?? 1
    );
  }, [beds]);

  useEffect(() => {
    setBathrooms((current) =>
      baths.some((option) => option.value === current) ? current : baths[0]?.value ?? 1
    );
  }, [baths]);

  useEffect(() => {
    setHalfBaths((current) =>
      halves.some((option) => option.value === current) ? current : halves[0]?.value ?? 0
    );
  }, [halves]);

  const quote = useMemo(
    () =>
      calculateQuote({
        service,
        homeType,
        bedrooms,
        bathrooms,
        halfBaths,
        addOns: [],
        frequency,
      }),
    [service, homeType, bedrooms, bathrooms, halfBaths, frequency]
  );

  /**
   * Exact Deep Cleaning package price for the selected home size, read from the
   * same BookingKoala extras tiers the booking page will charge. Guidance only —
   * it is never added to our own total or sent in the handoff.
   */
  const deepCleanPrice = useMemo(() => {
    if (service !== "standard") return null;
    const match = addOnsFor(service, quote.bedroomVariableId).find(
      (addOn) => addOn.id === DEEP_CLEAN_ADDON_ID
    );
    return match?.price ?? null;
  }, [service, quote.bedroomVariableId]);

  /**
   * What upkeep would cost if a One-Time deep-clean visitor switched to
   * Bi-Weekly — the gateway line on step 3. Derived, never hand-typed.
   */
  const biWeeklyPrice = useMemo(() => {
    const biWeekly = FREQUENCIES.find((option) => option.mostPopular) ?? null;
    if (!biWeekly || !selected.supportsRecurring) return null;
    return calculateQuote({
      service,
      homeType,
      bedrooms,
      bathrooms,
      halfBaths,
      addOns: [],
      frequency: biWeekly.id,
    }).ongoing;
  }, [service, homeType, bedrooms, bathrooms, halfBaths, selected.supportsRecurring]);

  /** True only when we can name a real package price for this home size. */
  const showDeepBreakdown = deepCleanIntent && deepCleanPrice !== null && !quote.quoteOnly;
  /** What the first clean really costs once the package is added at booking. */
  const deepFirstCleanBase = showDeepBreakdown ? quote.firstClean + (deepCleanPrice ?? 0) : null;

  /**
   * The add-on shelf. Ids and prices both come from the BookingKoala rows that
   * match this service + home size, so every figure on screen is exactly what
   * the booking page will charge. A row that fails to resolve is not rendered
   * at all — we never show a price we cannot attach an id to.
   */
  const shelf = useMemo(
    () => shelfExtrasFor(service, bedrooms, homeType),
    [service, bedrooms, homeType]
  );
  const petsExtra = useMemo(
    () => petsExtraForSelection(service, bedrooms, homeType),
    [service, bedrooms, homeType]
  );
  const travelExtra = useMemo(
    () => travelFeeExtraForSelection(service, bedrooms, homeType),
    [service, bedrooms, homeType]
  );

  /**
   * Deep intent already puts the package in the booking URL and in the shown
   * price, so its tile is displayed as locked-on rather than toggleable — it
   * must never enter the basket as well, which would charge it twice.
   */
  const isDeepRow = (name: string) => name.toLowerCase().startsWith("deep cleaning");

  const visibleShelf = useMemo(
    () => shelf.filter((extra) => !(deepCleanIntent && isDeepRow(extra.name))),
    [shelf, deepCleanIntent]
  );

  /** What renders: the interactive rows, plus the locked deep tile if any. */
  const shelfGroups = useMemo(() => groupExtras(shelf), [shelf]);


  // Any change of service or home size invalidates the resolved rows.
  useEffect(() => {
    setAddOns((current) => {
      const next: Record<string, number> = {};
      for (const [name, quantity] of Object.entries(current)) {
        if (visibleShelf.some((extra) => extra.name === name)) next[name] = quantity;
      }
      return next;
    });
  }, [visibleShelf]);

  const setQuantity = (extra: ResolvedExtra, quantity: number) =>
    setAddOns((current) => {
      const next = { ...current };
      const clamped = Math.max(0, Math.min(quantity, Math.min(20, extra.maxQuantity)));
      if (clamped === 0) delete next[extra.name];
      else next[extra.name] = clamped;
      return next;
    });

  const toggleAddOn = (extra: ResolvedExtra) =>
    setQuantity(extra, addOns[extra.name] ? 0 : 1);

  /**
   * Condition-aware nudge: a home that has not been properly cleaned in months
   * usually needs the Deep Cleaning package. We suggest it (never auto-add) so
   * the price is right today instead of adjusted on cleaning day.
   */
  const deepShelfRow = useMemo(
    () => visibleShelf.find((extra) => isDeepRow(extra.name)) ?? null,
    [visibleShelf]
  );

  /** Everything added, priced from its own resolved row. */
  const basketRows = useMemo(() => {
    const rows: { extra: ResolvedExtra; quantity: number }[] = [];
    for (const extra of visibleShelf) {
      const quantity = addOns[extra.name] ?? 0;
      if (quantity > 0) rows.push({ extra, quantity });
    }
    if (hasPets && petsExtra) rows.push({ extra: petsExtra, quantity: 1 });
    if (outsideCity && travelExtra) rows.push({ extra: travelExtra, quantity: 1 });
    return rows;
  }, [visibleShelf, addOns, hasPets, petsExtra, outsideCity, travelExtra]);

  const addOnTotal = basketRows.reduce(
    (sum, row) => sum + row.extra.price * row.quantity,
    0
  );

  const round2 = (value: number) => Math.round(value * 100) / 100;

  /**
   * BookingKoala charges selected extras on EVERY visit of a recurring
   * booking. Rows flagged `exempt_extra_from_freq_disc` (the travel fee, for
   * one) are charged at full price; the rest follow the frequency discount.
   * The flag is read from the config row — never hardcoded.
   */
  const recurringAddOnTotal = useMemo(() => {
    if (quote.ongoing === null) return 0;
    const discount = quote.discountPct / 100;
    return round2(
      basketRows.reduce((sum, row) => {
        const line = row.extra.price * row.quantity;
        return sum + (row.extra.exemptFromFrequencyDiscount ? line : line * (1 - discount));
      }, 0)
    );
  }, [basketRows, quote.ongoing, quote.discountPct]);

  /** Savings only ever claimed on the discountable portion. */
  const recurringAddOnSavings = useMemo(() => {
    if (quote.ongoing === null) return 0;
    const discount = quote.discountPct / 100;
    return round2(
      basketRows.reduce(
        (sum, row) =>
          row.extra.exemptFromFrequencyDiscount
            ? sum
            : sum + row.extra.price * row.quantity * discount,
        0
      )
    );
  }, [basketRows, quote.ongoing, quote.discountPct]);

  /** The real per-visit price, base + recurring add-ons. */
  const ongoingTotal =
    quote.ongoing === null ? null : round2(quote.ongoing + recurringAddOnTotal);
  const ongoingSavings = round2(quote.savings + recurringAddOnSavings);

  /** Name → quantity, exactly the shape the booking URL and the CRM want. */
  const extrasBasket = useMemo(() => {
    const basket: Record<string, number> = {};
    for (const row of basketRows) basket[row.extra.name] = row.quantity;
    return basket;
  }, [basketRows]);

  const basketLabels = useMemo(
    () =>
      Object.entries(extrasBasket).map(([name, quantity]) =>
        quantity > 1 ? `${name} ×${quantity}` : name
      ),
    [extrasBasket]
  );

  /** How many things the customer has added, for the live total line. */
  const addedCount = Object.keys(extrasBasket).length;

  /** The figure shown to the customer: base (+ deep package) (+ add-ons). */
  const firstCleanTotal = (deepFirstCleanBase ?? quote.firstClean) + addOnTotal;
  const deepFirstClean = deepFirstCleanBase === null ? null : deepFirstCleanBase + addOnTotal;
  /** Sticky panel: only override when the total differs from the base quote. */
  const panelFirstClean =
    deepFirstClean ?? (addOnTotal > 0 && !quote.quoteOnly ? firstCleanTotal : null);


  const priceLabel = quote.quoteOnly
    ? "Custom quote"
    : quote.isEstimate
      ? `${formatPrice(quote.rangeLow + addOnTotal)}–${formatPrice(quote.rangeHigh + addOnTotal)}`
      : formatPrice(firstCleanTotal);


  /** Home details in GoHighLevel's own option wording. */
  const homeFields = () => ({
    source: "dutycleaners.ca instant quote",
    city: proof.city.toLowerCase(),
    service: GHL_SERVICE_LABELS[service] ?? selected.label,
    home_type:
      (homeType !== null ? GHL_HOME_TYPE_LABELS[homeType] : undefined) ??
      homeTypes.find((option) => option.id === homeType)?.label ??
      "",
    bedrooms: ghlBedroomLabel(bedrooms),
    full_bathrooms: ghlBathroomLabel(bathrooms),
    half_baths: ghlHalfBathLabel(halfBaths),
    frequency:
      GHL_FREQUENCY_LABELS[getFrequency(frequency).bkId] ?? getFrequency(frequency).label,
    frequency_discount_pct: quote.discountPct,
    currency: "CAD" as const,
    full_name: contact.name,
    email: contact.email,
    phone: contact.phone,
    page_url: typeof window === "undefined" ? "" : window.location.href,
    submitted_at: new Date().toISOString(),
    intent: deepCleanIntent ? ("deep" as const) : null,
  });

  /** Step 2 → the lead itself. Step 3 only opens on a real 2xx. */
  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setFailed(false);

    // Inline, focus-managed validation — the browser bubble is not announced
    // reliably and disappears on the next keystroke.
    const nextErrors: { name?: string; email?: string; phone?: string } = {};
    if (contact.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim()))
      nextErrors.email = "Enter a valid email, like name@example.com.";
    if (contact.phone.replace(/\D/g, "").length < 10)
      nextErrors.phone = "Enter a 10-digit phone number so we can confirm your booking.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = nextErrors.name ? nameRef : nextErrors.email ? emailRef : phoneRef;
      first.current?.focus();
      return;
    }

    // Spam protection: the hidden field no human can fill is the only hard
    // block. A fast fill is a signal, not a verdict — decisive humans type
    // quickly, so the lead is still sent and simply flagged for the office.
    if (honeypot.trim() !== "") {
      setStep(2);
      return;
    }
    const tooFast = Date.now() - startedAtRef.current < MIN_FILL_MS;

    setSubmitting(true);
    const fields = homeFields();
    const result = await submitQuote({
      ...fields,
      source: tooFast ? `${fields.source} (fast fill — verify)` : fields.source,
    } as Partial<QuotePayload>);
    setSubmitting(false);

    if (result.ok) {
      setStep(2);
      return;
    }
    setFailed(true);
  };

  /** The step-3 payload: same contact, now carrying the quoted prices. */
  const confirmFields = () => ({
    ...homeFields(),
    // With deep intent the quoted first clean is Standard + the package, and
    // any add-on chip is included too, so the office's quote-vs-booking check
    // compares like with like.
    first_clean_price: quote.quoteOnly ? null : firstCleanTotal,
    recurring_price: ongoingTotal,
    addons: [
      ...(showDeepBreakdown ? ["Deep Cleaning (package)"] : []),
      ...basketLabels,

      ...(details.entry ? [`Entry: ${DC_ENTRY_LABELS[details.entry]}`] : []),
      ...(details.cleanliness
        ? [`Last cleaned: ${DC_CLEANLINESS_LABELS[details.cleanliness]}`]
        : []),
      ...(details.parking ? [`Parking: ${DC_PARKING_LABELS[details.parking]}`] : []),
      ...(details.postalCode?.trim() ? [`Postal code: ${details.postalCode.trim()}`] : []),
      ...(details.notes?.trim() ? [`Notes: ${details.notes.trim()}`] : []),

    ],
  }) as Partial<QuotePayload>;

  const bookingQuery = useMemo(
    () =>
      buildBookingQuery({
        service,
        homeType,
        bedrooms,
        bathrooms,
        halfBaths,
        frequencyBkId: getFrequency(frequency).bkId,
        deepClean: deepCleanIntent,
        extras: extrasBasket,
        cleanerDetails: details,
        coupon: promoCode,
        contact,
      }),
    [
      service,
      homeType,
      bedrooms,
      bathrooms,
      halfBaths,
      frequency,
      deepCleanIntent,
      extrasBasket,
      details,
      promoCode,
      contact,
    ]
  );


  const bookingUrl = bookingQuery === null ? null : `${BOOKING_ORIGIN}/booknow?${bookingQuery}`;

  /**
   * There used to be a Speculation Rules prefetch of `bookingUrl` here with
   * `eagerness: "immediate"`, to make the hop to BookingKoala paint instantly.
   * It was removed because that URL is not safe to send speculatively.
   *
   * buildBookingQuery() puts the visitor's first and last name, email, phone,
   * postal code and free-text entry instructions ("key is under the mat") in
   * the query string. Those ride along on the real navigation too, which is
   * BookingKoala's own form contract and something the visitor opts into by
   * pressing Book. A prefetch is different: it fires with no click at all, and
   * the effect re-ran on every keystroke, so a visitor who typed an address and
   * then abandoned the form still had their details written into the booking
   * host's access logs — repeatedly, in plaintext, having consented to nothing.
   *
   * Prefetching a PII-free URL instead would not help: the prefetch cache is
   * keyed on the exact URL, so it would never be used and would simply be a
   * wasted request. The `preconnect` and `dns-prefetch` tags below already
   * remove DNS, TCP and TLS from the hop, which is the dominant cost of a
   * cross-origin navigation. What is left on the table is small; what was
   * being leaked was not.
   */


  /**
   * Desktop keeps the summary bar out of the way while the real CTA is on
   * screen; mobile always shows it. Mobile is handled in CSS, so the observer
   * only has to answer "is the CTA visible?".
   */
  useEffect(() => {
    if (step !== 2) return;
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [step]);

  /** Primary CTA — hand the visitor to BookingKoala without waiting on GHL. */
  /**
   * Guards the handoff. Returns true when everything BookingKoala needs is
   * present; otherwise it marks the gaps and moves focus to the first one.
   */
  const requireCleanerDetails = () => {
    const errors: Record<string, string> = {};
    if (!details.entry) errors.entry = "Tell us how we get in.";
    if (!details.cleanliness) errors.cleanliness = "Pick when it was last properly cleaned.";
    if (!details.parking) errors.parking = "Tell us where to park.";
    if (!normalizePostalCode(details.postalCode)) {
      errors.postalCode = "Enter your postal code, e.g. T5J 0N3.";
    }
    setDetailErrors(errors);
    const first = ["entry", "cleanliness", "parking", "postalCode"].find((key) => errors[key]);
    if (!first) return true;
    const target = document.getElementById(
      first === "postalCode"
        ? "dc-zip"
        : first === "cleanliness"
          ? "dc-clean-group"
          : first === "parking"
            ? "dc-park-group"
            : "dc-entry-group"
    );
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (target instanceof HTMLInputElement) target.focus({ preventScroll: true });
    return false;
  };

  /** Pane A → pane B. Starts the second pane at the top, never mid-question. */
  const goToDetailsPane = () => {
    setPricePane("details");
    window.requestAnimationFrame(() => {
      stepHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      stepHeadingRef.current?.focus({ preventScroll: true });
    });
  };

  const goToBooking = () => {
    if (!bookingQuery || !bookingUrl) return;
    if (!requireCleanerDetails()) return;
    // A fresh, deliberate click always hands off — clear any stale guard first.
    clearHandoffFlag();
    // Fire and forget: the lead already exists from step 2, and the relay
    // records every attempt in quote_leads, so a failure here never blocks.
    void submitQuote(confirmFields()).catch(() => undefined);

    if (BOOKING_MODE === "embed") {
      // Same funnel, same domain — no interstitial needed. The intent flag is
      // ours only: /book strips it before handing the query to BookingKoala.
      navigate(`/book?${bookingQuery}${deepCleanIntent ? "&intent=deep" : ""}`);
      return;
    }

    setHandingOff(true);
    markHandoffFired();
    window.location.assign(bookingUrl);
  };


  /** Secondary CTA — the original callback request. */
  const requestCallback = async () => {
    if (step === 2 && !requireCleanerDetails()) return;
    setFailed(false);
    setSubmitting(true);
    const result = await submitQuote(confirmFields());
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    setFailed(true);
  };

  const failureNotice = failed && (
    <div
      role="alert"
      className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground"
    >
      <p className="flex items-start gap-2 font-semibold">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        Something went wrong — call {proof.phone} and we&rsquo;ll honour your quote.
      </p>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Your details are still on screen. You can also email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" className="min-h-[44px] bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={proof.phoneLink}>
            <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
            Call {proof.phone}
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="min-h-[44px]">
          <a href={`mailto:${SUPPORT_EMAIL}`}>
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Email us
          </a>
        </Button>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
          <Check className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Request received.</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We&rsquo;ll text you shortly (within {RESPONSE_TIME_PROMISE}) to confirm your time. Your{" "}
          {selected.label.toLowerCase()} in {proof.city} is quoted at {priceLabel}
          {ongoingTotal ? `, then ${formatPrice(ongoingTotal)} per visit` : ""}.
        </p>
        <RiskReversalRow className="mt-6 justify-center" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="min-h-[48px]">
            <a href={proof.phoneLink}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call {proof.phone}
            </a>
          </Button>
          {onClose && (
            <Button className="min-h-[48px] bg-accent text-accent-foreground hover:bg-accent/90" onClick={onClose}>
              Back to the site
            </Button>
          )}
        </div>
      </div>
    );
  }

  const showPrice = step === 2;

  return (
    <div className={showPrice ? "pb-32" : ""}>
      {/* Warm up the booking host so step 4 opens instantly. */}
      <Helmet>
        <link rel="preconnect" href={BOOKING_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={BOOKING_ORIGIN} />
      </Helmet>

      {/* Progress — one indicator for the whole funnel, so nothing on the page
          can disagree about how many steps there are. */}
      <div className="mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Instant price / {String(step + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground">
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle"
            />
            {STEP_LABELS[step]}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {Math.round(((step + 1) / TOTAL_STEPS) * 100)}% complete
          </span>
        </div>
        <ol className="sr-only">
          {STEP_LABELS.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined}>
              {label}
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
        </p>
        <div className="funnel-progress-track mt-3">
          <div
            className="funnel-progress-fill"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>


      <div
        className={
          showPrice ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" : "mx-auto max-w-2xl"
        }
      >
        <div>
          {/* ---------------- Step 1 — About your home ---------------- */}
          {step === 0 && (
            <div className="funnel-step">
              <StepHeader
                ref={step === 0 ? stepHeadingRef : null}
                number="01"
                eyebrow="Your home"
                title="About your home"
                companion="Start with what would make this week feel easier."
              />
              <fieldset>
                <legend className="mb-3 text-lg font-bold text-foreground">
                  {serviceExpanded ? "What type of clean do you need?" : "Your clean"}
                </legend>
                {!serviceExpanded ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-brand-navy/30 bg-secondary/50 p-4">
                    <span className="flex items-center gap-2 text-base font-bold text-foreground">
                      <Check className="h-5 w-5 text-brand-navy" aria-hidden="true" />
                      {selected.label}
                      {deepCleanIntent ? " + Deep Cleaning package" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServiceExpanded(true)}
                      className="inline-flex min-h-[44px] items-center text-base font-bold text-foreground underline underline-offset-4 hover:text-brand-navy"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                  {/* In the scan path: deep cleaning is a booking-page package, not a service. */}
                  {deepCleanIntent ? (
                    <p className="mb-3 rounded-sm border border-brand-navy/30 bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Deep clean — good choice.
                      </span>{" "}
                      Pick Standard below — we add your Deep Cleaning package to the price
                      on the next screen.
                    </p>
                  ) : (
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      Looking for a{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setService("standard");
                          setDeepCleanIntent(true);
                        }}
                        className="inline-flex min-h-[44px] items-center font-bold text-foreground underline underline-offset-4 hover:text-brand-navy"
                      >
                        Deep Cleaning
                      </button>
                      ? Choose Standard — we add the package to your price on the next
                      screen.
                    </p>
                  )}


                  <div className="grid gap-3 sm:grid-cols-2">

                    {SELECTABLE_SERVICES.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === service}
                        onClick={() => {
                          setService(option.id);
                          if (option.id !== "standard") setDeepCleanIntent(false);
                        }}
                        className={`min-h-[48px] rounded-sm border p-4 text-left transition-colors ${
                          option.id === service
                            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                            : "border-border bg-card text-foreground hover:border-brand-navy/40"
                        }`}
                      >
                        <span className="block font-bold">{option.label}</span>
                        <span
                          className={`mt-1 block text-sm ${
                            option.id === service
                              ? "text-brand-navy-foreground/75"
                              : "text-muted-foreground"
                          }`}
                        >
                          {option.blurb}
                          {option.id === "move-in-out" && (
                            <span className="mt-1 block font-semibold">
                              Already includes deep cleaning.
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  </>
                )}

                {/* Hourly / per-site work never enters the self-serve funnel. */}
                <p className="mt-3 text-base leading-relaxed text-foreground/80">
                  Short-term rental (Airbnb/VRBO) or commercial property? We price those
                  per-hour — call{" "}
                  <a href={proof.phoneLink} className="inline-flex min-h-[44px] items-center font-bold text-foreground underline underline-offset-4 hover:text-brand-navy">
                    {proof.phone}
                  </a>{" "}
                  or{" "}
                  <Link
                    to="/contact-us/"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] items-center font-bold text-foreground underline underline-offset-4 hover:text-brand-navy"
                  >
                    request a quote
                  </Link>{" "}
                  and we'll set you up.
                </p>
              </fieldset>


              {selected.asksHomeSize && (
                <div ref={homeSizeRef} className="space-y-6">
                  <Callout label="Counting rule">
                    Count offices, dens &amp; bonus rooms as bedrooms — we price by home size,
                    not rooms cleaned. Only want some rooms done? Still count them all.
                  </Callout>

                  {homeTypes.length > 0 && (
                    <div>
                      <Label htmlFor="homeType" className="text-base font-semibold">
                        What type of home?
                      </Label>
                      <select
                        id="homeType"
                        value={homeType ?? ""}
                        onChange={(event) => setHomeType(Number(event.target.value))}
                        className="funnel-field mt-2"
                      >
                        {homeTypes.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid gap-6">
                    <NumberChips
                      legend="Bedrooms"
                      options={beds}
                      value={bedrooms}
                      onChange={setBedrooms}
                      name="bedrooms"
                      caption
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      {baths.length > 0 && (
                        <NumberChips
                          legend="Full bathrooms"
                          options={baths}
                          value={bathrooms}
                          onChange={setBathrooms}
                          name="bathrooms"
                        />
                      )}

                      {halves.length > 0 && (
                        <NumberChips
                          legend="Half baths"
                          options={halves}
                          value={halfBaths}
                          onChange={setHalfBaths}
                          name="halfBaths"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <StepFooter above={<RiskReversalRow />}>
                <Button
                  size="lg"
                  className="min-h-[56px] w-full rounded-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto sm:px-10"
                  onClick={() => setStep(1)}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </StepFooter>

            </div>
          )}

          {/* ------------- Step 2 — Where to send the quote ------------- */}
          {step === 1 && (
            <form className="funnel-step" noValidate onSubmit={submitLead}>
              <StepHeader
                ref={step === 1 ? stepHeadingRef : null}
                number="02"
                eyebrow="Where to send it"
                title="Last step before your price."
                companion="A clear scope means fewer surprises at the door."
              >
                <p className="mt-3 text-muted-foreground">
                  Your {selected.label.toLowerCase()} details are saved. We ask for these so we can
                  send your quote and hold your price — no spam, no obligation.
                </p>
                {!quote.quoteOnly && (
                  <Callout label="Your starting price" className="mt-4">
                    Your {proof.city} {selected.label.toLowerCase()} starts from{" "}
                    <span className="font-bold text-foreground">
                      {formatPrice(quote.isEstimate ? quote.rangeLow : quote.firstClean)}
                    </span>{" "}
                    — add your details and the exact number appears on the next screen.
                  </Callout>
                )}
              </StepHeader>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" className="text-base font-semibold">
                    Full name <span className="text-accent" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="name"
                    ref={nameRef}
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="mt-2 h-12 text-base"
                    value={contact.name}
                    onChange={(event) => setContact({ ...contact, name: event.target.value })}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-2 text-base font-semibold text-destructive-ink">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email <span className="text-accent" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="mt-2 h-12 text-base"
                    value={contact.email}
                    onChange={(event) => setContact({ ...contact, email: event.target.value })}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-2 text-base font-semibold text-destructive-ink">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Phone <span className="text-accent" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="phone"
                    ref={phoneRef}
                    type="tel"
                    required
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className="mt-2 h-12 text-base"
                    value={contact.phone}
                    onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                  />
                  {errors.phone && (
                    <p id="phone-error" role="alert" className="mt-2 text-base font-semibold text-destructive-ink">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot: hidden from people and screen readers, catnip for bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company-website">Company website</label>
                <input
                  id="company-website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {failureNotice}

              <StepFooter
                above={
                  /* Reassurance sits ABOVE the button, where it is still read. */
                  <p className="text-sm text-muted-foreground">
                    You won&rsquo;t be charged today · No spam, no obligation · Prefer to talk?{" "}
                    <a href={proof.phoneLink} className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline">
                      {proof.phone}
                    </a>
                  </p>
                }
                back={
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex min-h-[48px] items-center gap-2 text-base font-semibold text-foreground underline underline-offset-4 hover:text-brand-navy"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
                }
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="min-h-[56px] w-full rounded-full bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                >
                  {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
                  Show My Price
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </StepFooter>

              {/* Proof at the point of hesitation. */}
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="text-brand-gold" aria-hidden="true">★★★★★</span>
                Rated 4.9 on Google by {proof.city} homeowners · customer-rated cleaners
              </p>

            </form>
          )}

          {/* ------------- Step 3 — Price reveal + booking handoff ------------- */}
          {step === 2 && (
            <div className="funnel-step [&_p]:max-w-[65ch]">
              <StepHeader
                ref={step === 2 ? stepHeadingRef : null}
                number="03"
                eyebrow="Your price"
                title={
                  pricePane === "price"
                    ? "Your price — lock in your time."
                    : "Last details, then pick your time"
                }
              >
                {/* Proof at the moment of doubt: the price is the hesitation point. */}
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="text-brand-gold" aria-hidden="true">★★★★★</span>
                  {proof.city === "Calgary" ? "1,000+" : "4,000+"} {proof.city} homes cleaned
                  <span aria-hidden="true">·</span>
                  Pay after your clean
                  <span aria-hidden="true">·</span>
                  Tell us within 24 hours and we&rsquo;ll re-clean at no charge
                </p>
              </StepHeader>



              {pricePane === "price" && (
                <>
              <div className="rounded-lg border border-quote-price-border bg-quote-price p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {selected.label} in {proof.city}
                </p>
                {showDeepBreakdown && deepFirstClean !== null ? (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Standard clean{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(quote.firstClean)}
                      </span>{" "}
                      + Deep Cleaning package{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(deepCleanPrice ?? 0)}
                      </span>{" "}
                      (your home size)
                      {addOnTotal > 0 && (
                        <>
                          {" "}
                          + add-ons{" "}
                          <span className="font-semibold text-foreground">
                            {formatPrice(addOnTotal)}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="mt-1 text-4xl font-bold text-foreground">
                      = First clean {formatPrice(deepFirstClean)}
                      <span className="ml-2 align-middle text-sm font-medium text-fine-print">
                        + 5% GST
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-fine-print">
                      {formatPrice(withGst(deepFirstClean))} with GST
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-4xl font-bold text-foreground">
                      {quote.quoteOnly ? priceLabel : `First clean ${priceLabel}`}
                      <span className="ml-2 align-middle text-sm font-medium text-fine-print">
                        + 5% GST
                      </span>
                    </p>
                    {!quote.isEstimate && !quote.quoteOnly && (
                      <p className="mt-1 text-sm text-fine-print">
                        {formatPrice(withGst(firstCleanTotal))} with GST
                      </p>
                    )}
                  </>
                )}

                {quote.ongoing !== null && (
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    Then {formatPrice(ongoingTotal ?? 0)} per visit
                    <span className="ml-3 inline-block bg-brand-navy px-3 py-1 text-sm font-bold text-brand-gold">
                      Saving {formatPrice(ongoingSavings)} per visit
                    </span>
                  </p>
                )}
                {quote.ongoing !== null && recurringAddOnTotal > 0 && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Your add-ons apply to every visit
                    {basketRows.some((row) => row.extra.exemptFromFrequencyDiscount)
                      ? " — some, like the travel fee, are charged at full price"
                      : ""}
                    .
                  </p>
                )}
                {showDeepBreakdown && quote.ongoing !== null && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Recurring visits are Standard upkeep; the package applies to your first clean.
                  </p>
                )}
                {showDeepBreakdown && quote.ongoing === null && biWeeklyPrice !== null && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Most deep-clean customers switch to Bi-Weekly upkeep after — that&rsquo;d be{" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice(biWeeklyPrice)}
                    </span>
                    /visit.
                  </p>
                )}

                <p className="mt-3 text-muted-foreground">
                  {selected.asksHomeSize
                    ? `${bedrooms} bed · ${bathrooms} bath${halfBaths > 0 ? ` · ${halfBaths} half bath` : ""} · flat rate, we stay until the checklist is done`
                    : "Flat rate — we stay until the checklist is done"}
                </p>
                {quote.rateNote && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {quote.rateNote}
                  </p>
                )}
                {/* Deep Cleaning is a tile on the shelf below — no booking-page
                    instruction here, which used to contradict it. */}
                {deepCleanPrice !== null && deepCleanIntent && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Your Deep Cleaning package is included below
                    </span>{" "}
                    — already in this price.
                  </p>
                )}

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Not happy? We re-clean within 24 hours of notice — free.
                </p>

              </div>


              {selected.supportsRecurring && (
                <div>
                  <p className="mb-3 text-lg font-bold text-foreground">
                    Change how often and watch the price update
                  </p>
                  <p className="-mt-2 mb-3 text-[0.9375rem] text-muted-foreground">
                    Keep the reset without rebuilding the plan each time.
                  </p>
                  <FrequencyChips value={frequency} onChange={setFrequency} />

                  {/* The saving, stated where the choice is made. Dollars lead;
                      the percentage reinforces. The struck figure is the real
                      first-clean price, so the comparison is truthful. */}
                  {quote.ongoing !== null && quote.savings > 0 && (
                    <div
                      key={frequency}
                      className="savings-appear mt-4 rounded-lg border border-savings-border bg-savings p-5 text-savings-foreground"
                    >
                      <p className="text-base font-semibold">
                        <span className="line-through">{formatPrice(firstCleanTotal)}</span>{" "}
                        first clean &rarr;
                      </p>
                      <p className="text-3xl font-bold leading-tight">
                        {formatPrice(ongoingTotal ?? 0)}
                        <span className="ml-2 align-middle text-base font-semibold">
                          +GST per visit
                        </span>
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-sm bg-savings-foreground px-3 py-1.5 text-base font-bold text-savings">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Save {formatPrice(ongoingSavings)} per visit
                        {basketRows.some((row) => row.extra.exemptFromFrequencyDiscount)
                          ? ""
                          : ` (${quote.discountPct}%)`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {petsExtra && (
                <fieldset className="rounded-lg border border-quote-shelf-border bg-quote-shelf p-5">
                  <legend className="px-1 text-lg font-bold text-foreground">
                    Do you have pets? (+{formatPrice(petsExtra.price)})
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ].map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        aria-pressed={hasPets === option.value}
                        onClick={() => {
                          setHasPets(option.value);
                          peek(shelfRef);
                        }}
                        className={`min-h-[48px] min-w-[96px] rounded-sm border px-4 py-2 text-base font-semibold transition-colors ${
                          hasPets === option.value
                            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                            : "border-border bg-card text-foreground hover:bg-secondary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}


              {shelfGroups.length > 0 && (
                <div ref={shelfRef} className="rounded-lg border border-quote-shelf-border bg-quote-shelf p-5">
                  <h3 className="text-lg font-bold text-foreground">
                    Want to add anything? (optional)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    These aren&rsquo;t part of the standard checklist — add only what you need.
                  </p>
                  {deepCleanIntent && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Your Deep Cleaning package is included below.
                    </p>
                  )}

                  <div className="mt-4 space-y-6">
                    {(() => {
                      const renderGroup = ({ group, items }: (typeof shelfGroups)[number]) => (
                      <div key={group}>
                        <h4 className="mb-2 text-[13px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {group}
                        </h4>
                        <ul className="grid gap-3 md:grid-cols-2">
                          {items.map((extra) => {
                            const locked = deepCleanIntent && isDeepRow(extra.name);
                            const quantity = locked ? 1 : (addOns[extra.name] ?? 0);
                            const isQuantity = extra.maxQuantity > 1;
                            const max = Math.min(20, extra.maxQuantity);
                            const added = quantity > 0;
                            const benefit = benefitForExtra(extra.name);
                            const unit = isQuantity ? unitSuffixFor(extra.name) : "";
                            const inputId = `addon-${extra.id}`;
                            return (
                              <li key={extra.name} className="h-full">
                                <div
                                  className={`flex h-full min-h-[44px] flex-col gap-1.5 rounded-lg border-[1.5px] px-4 py-3 transition-all ${
                                    added
                                      ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                                      : "border-brand-navy/25 bg-card text-foreground hover:-translate-y-0.5 hover:border-brand-navy"
                                  }`}
                                >
                                  {isQuantity ? (
                                    <>
                                      <p className="text-base font-semibold">
                                        {extraDisplayName(extra.name)}{" "}
                                        <span className="font-bold">
                                          +{formatPrice(extra.price)}
                                          {unit}
                                        </span>
                                      </p>
                                      {benefit && (
                                        <p
                                          className={`text-[13px] leading-snug ${
                                            added
                                              ? "text-brand-navy-foreground/80"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {benefit}
                                        </p>
                                      )}
                                      <div className="mt-auto flex items-center gap-2 pt-1">
                                        {quantity === 0 ? (
                                          <button
                                            type="button"
                                            onClick={() => setQuantity(extra, 1)}
                                            className="min-h-[48px] w-full rounded-sm border border-brand-navy px-4 text-base font-bold text-brand-navy hover:bg-secondary"
                                          >
                                            Add
                                          </button>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => setQuantity(extra, quantity - 1)}
                                              aria-label={`Remove one ${extra.name}`}
                                              className={`h-12 w-12 border text-lg font-bold ${
                                                added
                                                  ? "border-brand-navy-foreground/40"
                                                  : "border-border"
                                              }`}
                                            >
                                              &minus;
                                            </button>
                                            <span
                                              className="min-w-[2ch] text-center text-base font-bold"
                                              aria-label={`${extra.name} quantity`}
                                            >
                                              {quantity}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => setQuantity(extra, quantity + 1)}
                                              disabled={quantity >= max}
                                              aria-label={`Add one ${extra.name}`}
                                              className={`h-12 w-12 border text-lg font-bold disabled:opacity-40 ${
                                                added
                                                  ? "border-brand-navy-foreground/40"
                                                  : "border-border"
                                              }`}
                                            >
                                              +
                                            </button>
                                          </>
                                        )}
                                      </div>

                                    </>
                                  ) : (
                                    <label
                                      htmlFor={inputId}
                                      className={`flex h-full cursor-pointer flex-col gap-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ring ${
                                        locked ? "cursor-default" : ""
                                      }`}
                                    >
                                      <input
                                        id={inputId}
                                        type="checkbox"
                                        className="sr-only"
                                        checked={added}
                                        disabled={locked}
                                        onChange={() => toggleAddOn(extra)}
                                      />
                                      <span className="flex items-start justify-between gap-3">
                                        <span className="flex items-start gap-2 text-base font-semibold">
                                          {added && (
                                            <Check
                                              className="mt-0.5 h-5 w-5 shrink-0"
                                              aria-hidden="true"
                                            />
                                          )}
                                          <span>
                                            {extraDisplayName(extra.name)}{" "}
                                            <span className="font-bold">
                                              +{formatPrice(extra.price)}
                                            </span>
                                          </span>
                                        </span>
                                        <span className="shrink-0 text-sm font-bold">
                                          {added ? "Added ✓" : "Add"}
                                        </span>
                                      </span>
                                      {benefit && (
                                        <span
                                          className={`text-[13px] leading-snug ${
                                            added
                                              ? "text-brand-navy-foreground/80"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {benefit}
                                        </span>
                                      )}
                                    </label>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      );
                      return <>{shelfGroups.map(renderGroup)}</>;
                    })()}
                  </div>

                  {!quote.quoteOnly && !quote.isEstimate && (
                    <p
                      aria-live="polite"
                      className="mt-5 rounded-sm bg-card p-4 text-lg font-bold text-foreground"
                    >
                      {addedCount === 0
                        ? `First clean ${formatPrice(firstCleanTotal)} — no add-ons yet`
                        : `${addedCount} add-on${addedCount === 1 ? "" : "s"} · +${formatPrice(
                            addOnTotal
                          )} → first clean ${formatPrice(firstCleanTotal)}`}
                    </p>
                  )}

                </div>
              )}






              <StepFooter
                back={
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex min-h-[48px] items-center gap-2 text-base font-semibold text-foreground underline underline-offset-4 hover:text-brand-navy"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Change details
                  </button>
                }
              >
                <Button
                  size="lg"
                  onClick={goToDetailsPane}
                  className="min-h-[56px] w-full rounded-full bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </StepFooter>
                </>
              )}

              {pricePane === "details" && (
                <>
              {/* Details for your cleaner. The booking page requires these to
                  confirm the clean, so they are asked here, in the open — the
                  answers ride along as dc_* and are never typed twice. */}
              <div
                id="dc-group"
                className="scroll-mt-24 rounded-lg border border-quote-detail-border bg-quote-detail p-5"
              >
                <h3 className="text-lg font-bold text-foreground">Details for your cleaner</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Your booking can&rsquo;t be confirmed without these — answer them here and skip
                  them at checkout.
                </p>


                <fieldset id="dc-entry-group" className="mt-4 scroll-mt-24">
                  <legend className="text-base font-bold text-foreground">
                    How do we enter the home? <span className="text-accent">*</span>
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {DC_ENTRY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={details.entry === option.value}
                        onClick={() =>
                          setDetails((current) => ({
                            ...current,
                            entry: current.entry === option.value ? null : option.value,
                          }))
                        }
                        className={`min-h-[48px] rounded-sm border px-4 text-base font-semibold transition-colors ${
                          details.entry === option.value
                            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                            : "border-border bg-card text-foreground hover:border-brand-navy"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {detailErrors.entry && (
                    <p className="mt-2 text-sm font-semibold text-destructive">{detailErrors.entry}</p>
                  )}
                </fieldset>

                <fieldset id="dc-clean-group" className="mt-5 scroll-mt-24">
                  <legend className="text-base font-bold text-foreground">
                    When was it last properly cleaned? <span className="text-accent">*</span>
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {DC_CLEANLINESS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={details.cleanliness === option.value}
                        onClick={() =>
                          setDetails((current) => ({
                            ...current,
                            cleanliness:
                              current.cleanliness === option.value ? null : option.value,
                          }))
                        }
                        className={`min-h-[48px] rounded-sm border px-4 text-base font-semibold transition-colors ${
                          details.cleanliness === option.value
                            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                            : "border-border bg-card text-foreground hover:border-brand-navy"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {detailErrors.cleanliness && (
                    <p className="mt-2 text-sm font-semibold text-destructive">{detailErrors.cleanliness}</p>
                  )}

                  {(details.cleanliness ?? 0) >= 4 &&
                    !deepCleanIntent &&
                    !deepNudgeDismissed &&
                    deepShelfRow &&
                    !addOns[deepShelfRow.name] && (
                      <div
                        role="status"
                        className="mt-3 rounded-lg border border-brand-navy/25 bg-brand-navy/5 p-4"
                      >
                        <p className="text-sm leading-relaxed text-foreground">
                          Homes in this condition usually need a Deep Cleaning — it&rsquo;s built for
                          built-up grime and takes longer. Booking it now means an accurate price
                          today instead of an adjustment on cleaning day.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setQuantity(deepShelfRow, 1)}
                            className="min-h-[48px] rounded-sm bg-accent px-5 text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
                          >
                            Add Deep Cleaning +{formatPrice(deepShelfRow.price)}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeepNudgeDismissed(true)}
                            className="min-h-[48px] rounded-sm px-4 text-base font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
                          >
                            No thanks
                          </button>
                        </div>
                      </div>
                    )}
                </fieldset>

                <fieldset id="dc-park-group" className="mt-5 scroll-mt-24">
                  <legend className="text-base font-bold text-foreground">
                    Where should we park? <span className="text-accent">*</span>
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {DC_PARKING_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={details.parking === option.value}
                        onClick={() =>
                          setDetails((current) => ({
                            ...current,
                            parking: current.parking === option.value ? null : option.value,
                          }))
                        }
                        className={`min-h-[48px] rounded-sm border px-4 text-base font-semibold transition-colors ${
                          details.parking === option.value
                            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                            : "border-border bg-card text-foreground hover:border-brand-navy"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {detailErrors.parking && (
                    <p className="mt-2 text-sm font-semibold text-destructive">{detailErrors.parking}</p>
                  )}
                </fieldset>

                {/* Postal code now lives beside the price, where the travel
                    fee it controls is shown. */}



                {/* Postal code sits with the price because it decides the
                    travel fee — one question, answered where it matters. */}
                <div className="mt-5">
                  <Label htmlFor="dc-zip" className="text-base font-bold text-foreground">
                    Your postal code <span className="text-accent">*</span>
                  </Label>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Required to book — it confirms instantly whether a travel fee applies.
                  </p>
                  <input
                    id="dc-zip"
                    inputMode="text"
                    autoComplete="postal-code"
                    maxLength={7}
                    value={details.postalCode ?? ""}
                    onChange={(event) =>
                      setDetails((current) => ({
                        ...current,
                        postalCode: formatPostalInput(event.target.value),
                      }))
                    }
                    className="mt-2 w-full max-w-[12rem] rounded-sm border border-input bg-card p-3 text-base uppercase text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    placeholder="T5J 0N3"
                  />
                  {detailErrors.postalCode && (
                    <p className="mt-2 text-sm font-semibold text-destructive">
                      {detailErrors.postalCode}
                    </p>
                  )}
                  {(details.postalCode ?? "").length >= 7 && cityStatus === "unknown" && (
                    <p className="mt-1 text-sm text-fine-print">
                      That doesn&rsquo;t look like a Canadian postal code — we&rsquo;ll confirm it
                      with you.
                    </p>
                  )}
                </div>


                {outsideCity && travelExtra && (
                  <p className="mt-3 text-base font-semibold text-foreground">
                    + {formatPrice(travelExtra.price)} travel fee (outside city limits)
                  </p>
                )}

                {/* A valid postal code is the SOURCE OF TRUTH: it replaces the
                    Yes/No question with a visible statement, so the price can
                    never change without the customer seeing why. */}
                {travelExtra && cityStatus === "inside" && (
                  <p className="mt-3 rounded-sm bg-secondary/60 p-3 text-base font-semibold leading-relaxed text-foreground">
                    ✓ {postalCodeCityName(details.postalCode) ?? "In-city"} postal code
                    {" "}({normalizePostalCode(details.postalCode)}) — no travel fee.
                    {insideCity === false
                      ? " This replaces your earlier answer."
                      : ""}
                  </p>
                )}

                {travelExtra && cityStatus === "outside" && (
                  <p className="mt-3 rounded-sm bg-secondary/60 p-3 text-base leading-relaxed text-foreground">
                    <span className="font-semibold">
                      {normalizePostalCode(details.postalCode)} is outside Edmonton/Calgary city
                      limits
                    </span>{" "}
                    — a {formatPrice(travelExtra.price)} travel fee applies; it covers the extra
                    travel time.
                    {insideCity === true ? " This replaces your earlier answer." : ""}
                  </p>
                )}

                {/* Asked only when the postal code can't answer it. */}
                {travelExtra && cityStatus === "unknown" && (details.postalCode ?? "").length >= 6 && (
                  <fieldset className="mt-5 rounded-sm border border-border bg-card p-4">
                    <legend className="px-1 text-base font-bold text-foreground">
                      Is your service address inside Edmonton or Calgary city limits?
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {[
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ].map((option) => (
                        <label
                          key={option.label}
                          className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-sm border border-border px-4 text-base font-semibold text-foreground hover:border-brand-navy"
                        >
                          <input
                            type="radio"
                            name="inside-city"
                            className="h-5 w-5 accent-brand-navy"
                            checked={insideCity === option.value}
                            onChange={() => setInsideCity(option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                    {insideCity === false && (
                      <p className="mt-3 rounded-sm bg-secondary/60 p-3 text-base leading-relaxed text-foreground">
                        A {formatPrice(travelExtra.price)} travel fee applies outside city limits —
                        it covers the extra travel time.
                      </p>
                    )}
                  </fieldset>
                )}


                <Callout label="Travel fee" className="mt-4">
                  Addresses outside Edmonton or Calgary city limits include a travel fee — we
                  confirm before your clean.
                </Callout>

                <div className="mt-5">
                  <Label htmlFor="dc-notes" className="text-base font-bold text-foreground">
                    Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <textarea
                    id="dc-notes"
                    rows={3}
                    maxLength={DC_NOTES_MAX}
                    value={details.notes ?? ""}
                    onChange={(event) =>
                      setDetails((current) => ({
                        ...current,
                        notes: event.target.value.slice(0, DC_NOTES_MAX),
                      }))
                    }
                    className="mt-2 w-full rounded-sm border border-input bg-card p-3 text-base text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    placeholder="Pets, fragile items, a room to skip…"
                  />
                  <p className="mt-1 text-sm text-fine-print">
                    {(details.notes ?? "").length}/{DC_NOTES_MAX} characters
                  </p>
                </div>
              </div>

              {failureNotice}

              <StepFooter
                back={
                  <button
                    type="button"
                    onClick={() => setPricePane("price")}
                    className="inline-flex min-h-[48px] items-center gap-2 text-base font-semibold text-foreground underline underline-offset-4 hover:text-brand-navy"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to my price
                  </button>
                }
              >
                <div ref={ctaRef}>
                  {bookingUrl ? (
                    <Button
                      size="lg"
                      onClick={goToBooking}
                      className="min-h-[56px] w-full rounded-full bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                    >
                      Choose my date &amp; time
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      disabled={submitting}
                      onClick={requestCallback}
                      className="min-h-[56px] w-full rounded-full bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                    >
                      {submitting && (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      )}
                      Request my booking
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </StepFooter>

              {bookingUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Pick your time, add your address &amp; card — about 90 seconds.
                    {deepCleanIntent
                      ? " Your Deep Cleaning package is already added."
                      : ""}
                  </p>
                  <button
                    type="button"
                    onClick={requestCallback}
                    disabled={submitting}
                    className="inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-foreground underline underline-offset-4"
                  >
                    {submitting && (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    )}
                    Prefer we call you? Request a callback instead
                  </button>
                </div>
              )}

                </>
              )}

              <RiskReversalRow />

            </div>
          )}
        </div>

        {showPrice && (
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <PricePanel
                quote={quote}
                variant="compact"
                serviceLabel={`${selected.label} · ${proof.city}`}
                firstCleanOverride={panelFirstClean}
                ongoingOverride={ongoingTotal}
                savingsOverride={ongoingSavings}
                ongoingNote={
                  recurringAddOnTotal > 0
                    ? `Includes ${formatPrice(recurringAddOnTotal)} of add-ons charged every visit`
                    : undefined
                }
                firstCleanNote={
                  showDeepBreakdown
                    ? `Includes the ${formatPrice(deepCleanPrice ?? 0)} Deep Cleaning package${
                        addOnTotal > 0 ? ` and ${formatPrice(addOnTotal)} of add-ons` : ""
                      }`
                    : addOnTotal > 0
                      ? `Includes ${formatPrice(addOnTotal)} of add-ons${
                          outsideCity && travelExtra
                            ? ` (incl. ${formatPrice(travelExtra.price)} travel fee)`
                            : ""
                        }`
                      : undefined
                }
                addOnCount={basketRows.length}
              />
              <a
                href={proof.phoneLink}
                className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-border bg-card font-semibold text-foreground hover:bg-secondary"
              >
                <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                Prefer to talk? {proof.phone}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Sticky summary: always on mobile, and on desktop only while the real
          CTA is scrolled out of view. */}
      {showPrice && (
        <div
          className={`fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card px-4 py-3 shadow-[0_-4px_16px_hsl(var(--brand-navy)/0.12)] ${
            ctaVisible ? "lg:hidden" : ""
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-muted-foreground">
                {selected.label}
                {addedCount > 0
                  ? ` · ${addedCount} add-on${addedCount === 1 ? "" : "s"}`
                  : ""}
              </p>
              <p className="text-lg font-bold leading-tight text-foreground">
                {quote.quoteOnly ? priceLabel : `First clean ${priceLabel}`}
              </p>
              {ongoingTotal !== null && (
                <p className="truncate text-sm text-fine-print">
                  then {formatPrice(ongoingTotal)} per visit
                </p>
              )}
              {outsideCity && travelExtra && (
                <p className="truncate text-sm text-fine-print">
                  incl. {formatPrice(travelExtra.price)} travel fee
                </p>
              )}
            </div>
            <Button
              size="lg"
              disabled={submitting}
              onClick={
                pricePane === "price"
                  ? goToDetailsPane
                  : bookingUrl
                    ? goToBooking
                    : requestCallback
              }
              className="min-h-[52px] shrink-0 bg-accent px-5 text-base font-bold text-accent-foreground hover:bg-accent/90"
            >
              {pricePane === "price" ? "Continue" : bookingUrl ? "Choose my time" : "Request booking"}
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Embed mode: load the booking form invisibly while the visitor reads
          their price, so /book paints from cache with a warm connection. */}
      {BOOKING_MODE === "embed" && step === 2 && bookingQuery && (
        <BookingEmbed query={bookingQuery} warmup />
      )}

      {handingOff && bookingUrl && (
        <BookingHandoff
          priceLabel={priceLabel}
          bookingUrl={bookingUrl}
          hasAddOns={Object.keys(extrasBasket).length > 0}
        />
      )}

    </div>
  );
}
