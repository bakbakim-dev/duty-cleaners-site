import { Mail, Phone } from "lucide-react";
import { POLICY } from "@/data/policy";
import { SUPPORT_EMAIL } from "@/data/proof";

interface DirectContactPanelProps {
  phone: string;
  phoneLink: string;
  /** Picks the wording; the terms are the same in both cities. */
  city?: "Edmonton" | "Calgary";
}

const COPY = {
  Edmonton: {
    heading: "Or reach out directly.",
    terms: `No payment today · Free to reschedule with ${POLICY.cancellationNoticeHours} hours' notice · No contracts.`,
  },
  Calgary: {
    heading: "Or talk to the Calgary office.",
    terms: `Nothing charged today · Reschedule free with ${POLICY.cancellationNoticeHours} hours' notice · No contract to sign.`,
  },
} as const;

/**
 * Dark companion panel for the closing quote form — the "or just talk to a
 * person" route, with the no-pressure terms restated underneath.
 */
export default function DirectContactPanel({ phone, phoneLink, city = "Edmonton" }: DirectContactPanelProps) {
  const copy = COPY[city];
  return (
    <aside className="flex h-full flex-col justify-between bg-brand-navy p-7 text-brand-navy-foreground lg:p-8">
      <div>
        <h3 className="display-serif text-2xl font-bold">{copy.heading}</h3>

        <div className="mt-6 border-t border-white/15 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Phone</p>
          <a
            href={phoneLink}
            className="mt-1.5 inline-flex items-center gap-2.5 text-lg font-bold text-white underline-offset-4 hover:underline"
          >
            <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            {phone}
          </a>
          <p className="mt-1 text-sm text-white/70">Mon–Sat 8 AM–8 PM · Sun 9 AM–3 PM</p>
        </div>

        <div className="mt-5 border-t border-white/15 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Email</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-1.5 inline-flex items-center gap-2.5 font-bold text-white underline-offset-4 hover:underline"
          >
            <Mail className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <p className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/70">{copy.terms}</p>
    </aside>
  );
}
