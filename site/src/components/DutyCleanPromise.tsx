import { Link } from "react-router-dom";
import { BadgeCheck, HeartHandshake, Receipt, RotateCcw, type LucideIcon } from "lucide-react";
import { POLICY } from "@/data/policy";
import { COMPANY } from "@/data/proof";
import Eyebrow from "@/components/Eyebrow";

interface Pillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/**
 * Two voices for one set of terms. Both hubs render this block, and the
 * money-page contract caps how much of the Calgary hub may repeat the
 * Edmonton one. Nothing differs between the cities except the wording; the
 * figures come from policy.ts either way. The About page uses the default.
 */
/** "under 5%" at the start of a sentence. */
const ACCEPTANCE = COMPANY.applicantAcceptanceRate.charAt(0).toUpperCase() + COMPANY.applicantAcceptanceRate.slice(1);

const PILLARS: Record<"Edmonton" | "Calgary", Pillar[]> = {
  Edmonton: [
    {
      icon: BadgeCheck,
      // The trust strip at the top of the hub already says reference-checked
      // and customer-rated in almost these words; this card adds the one
      // vetting fact the page did not state (owner's figure, proof.ts).
      title: "Who cleans your home",
      desc: `${ACCEPTANCE} of applicants are accepted, and the customer rates every clean.`,
    },
    {
      icon: HeartHandshake,
      title: "No need to tidy first",
      // "You do not need to tidy before we arrive" contradicted the service
      // pages, which ask for clutter to be picked up. One sentence that is
      // true of both, worded identically on every page that makes the claim.
      desc: "You do not need to clean before the team comes: clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on. Describe the home as it is on the booking form and the team arrives briefed. The jobs we do not take on are biohazards and infestations: bodily fluids, animal waste, mould remediation, pests and rodents.",
    },
    {
      icon: Receipt,
      title: "Priced from what you tell us",
      desc: "The price is set by home size, worked out from what you enter on the booking form, for a home in the condition you describe. Some things only show themselves once we start: heavy build-up, clutter, far more glass or cabinetry than the form described. When that happens, the team explains what it found, and any extra charge is agreed with you before that work is done.",
    },
    {
      icon: RotateCcw,
      title: `${POLICY.guaranteeWindowHours}-hour re-clean guarantee`,
      desc: `Tell us within ${POLICY.guaranteeWindowHours} hours if anything was missed and the team comes back to re-clean it at no charge. Photos help but are not required, and the commitment is the return visit rather than a refund.`,
    },
  ],
  Calgary: [
    {
      icon: BadgeCheck,
      title: "Who we send",
      desc: `Of the people who apply to clean for us, ${COMPANY.applicantAcceptanceRate} are accepted. Each visit is then rated by the customer.`,
    },
    {
      icon: HeartHandshake,
      title: "No clean-up before we arrive",
      desc: "You do not need to clean before the team comes: clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on. Say on the booking form what state the place is in, and the team comes prepared for it. The team does not take on bodily fluids, animal waste, mould remediation, pests or rodents.",
    },
    {
      icon: Receipt,
      title: "Priced from your description",
      desc: "The quote comes from the home size you enter, and a clean that runs long costs the same. Some things only show up once the team is through the door: heavy build-up, more cabinets than expected, a glass railing. When the job is substantially bigger than described, the team tells you what it found and the options before carrying on.",
    },
    {
      icon: RotateCcw,
      title: "A return visit, at no charge",
      desc: `Anything missed, reported within ${POLICY.guaranteeWindowHours} hours, is re-cleaned on a return visit at no charge. It is not a money-back guarantee, though you can always call the Calgary office to talk it through.`,
    },
  ],
};

const COPY = {
  Edmonton: {
    eyebrow: "Included With Every Clean",
    lead: "The team works through the checklist for the service you booked, in one visit.",
  },
  Calgary: {
    eyebrow: "Standing terms, every Calgary visit",
    // Was a line in quotation marks with no speaker, opening on "Calgary is hard
    // on floors and easy on nothing". Now the four terms below, in a sentence.
    lead: `These terms come with every Calgary clean: checked references, a price worked out from what you tell us, and a return visit at no charge for anything missed and reported within ${POLICY.guaranteeWindowHours} hours.`,
  },
} as const;

export default function DutyCleanPromise({ city = "Edmonton" }: { city?: "Edmonton" | "Calgary" }) {
  const pillars = PILLARS[city];
  const copy = COPY[city];
  return (
    <section className="py-20 md:py-24 bg-brand-navy relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric split: heading and lead sentence left, the four terms right. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-xl">
            {/* index.css remaps .text-accent to the on-dark accent inside .bg-brand-navy. */}
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 className="display-serif display-2 text-white mt-3 mb-5">
              The Duty Clean <span className="text-accent-on-dark">Promise</span>
            </h2>
            <p className="max-w-[46ch] text-lg leading-relaxed text-white/90">{copy.lead}</p>
            <Link
              to="/satisfaction-guarantee/"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-accent-on-dark font-semibold hover:underline underline-offset-4 group"
            >
              How the re-clean guarantee works
              <span className="dc-icon dc-icon-arrow-right w-4 h-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-accent/20 bg-accent/15">
                  <pillar.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/90">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
