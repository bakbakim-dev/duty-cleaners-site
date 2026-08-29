import { Link } from "react-router-dom";
import { BadgeCheck, HeartHandshake, Receipt, RotateCcw, ArrowRight, type LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const pillars: Pillar[] = [
  {
    icon: BadgeCheck,
    title: "Earned Trust, Every Visit",
    desc: "Every cleaner is reference-checked before their first job — then rated by the customer after every single clean. Those ratings decide who keeps cleaning for us. Trust isn't something our cleaners claim; it's something they earn at every visit.",
  },
  {
    icon: HeartHandshake,
    title: "Judgment-Free, Always",
    desc: "Some homes have gotten away from people — after an illness, a hard season, or just a busy year. We clean without commentary. No photos, no lectures, no raised eyebrows.",
  },
  {
    icon: Receipt,
    title: "Priced on What You Tell Us",
    desc: "Your quote is built from your home's size and condition as you describe them. Some things only show themselves once we start — built-up grime under the surface, extra cabinets, glass railings. When the job turns out bigger than described, we'll let you know what changed and why.",
  },
  {
    icon: RotateCcw,
    title: "Make-It-Right Guarantee",
    desc: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge.",
  },
];

export default function DutyCleanPromise() {
  return (
    <section className="py-20 md:py-24 bg-brand-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric split: editorial pull-quote left, compact proof right. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-xl">
            <span className="text-accent-on-dark font-semibold text-sm uppercase tracking-wider">Included With Every Clean</span>
            <h2 className="display-serif display-2 text-white mt-3 mb-5">
              The Duty Clean <span className="text-accent-on-dark">Promise</span>
            </h2>
            <p className="display-serif display-quote font-normal text-white/95">
              &ldquo;Trust isn&rsquo;t something our cleaners claim — it&rsquo;s something they earn at every visit.&rdquo;
            </p>
            <Link
              to="/satisfaction-guarantee/"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-accent-on-dark font-semibold hover:underline underline-offset-4 group"
            >
              Read our full Satisfaction Guarantee
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="motion-lift flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/15">
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

