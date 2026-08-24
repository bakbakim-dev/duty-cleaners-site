import { forwardRef } from "react";

/**
 * Shared chapter heading for every funnel step: numbered badge, orange eyebrow,
 * editorial headline and the muted companion line. One implementation so all
 * four steps keep the same rhythm. Purely presentational — no motifs, no
 * decoration, per the funnel constraints.
 */
const StepHeader = forwardRef<
  HTMLHeadingElement,
  {
    number: string;
    eyebrow: string;
    title: React.ReactNode;
    companion?: string;
    children?: React.ReactNode;
  }
>(function StepHeader({ number, eyebrow, title, companion, children }, ref) {
  return (
    <div className="funnel-chapter">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-secondary text-sm font-bold text-secondary-foreground"
        >
          {number}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
      </div>
      <h2
        ref={ref}
        tabIndex={-1}
        className="display-serif mt-3 text-3xl font-bold leading-tight text-foreground focus:outline-none"
      >
        {title}
      </h2>
      {companion && (
        <p className="mt-2 text-[0.9375rem] text-muted-foreground">{companion}</p>
      )}
      {children}
    </div>
  );
});

export default StepHeader;

/**
 * Labeled note rail — pale field with an orange left rule, small-caps label and
 * the sentence beside it. Replaces the loose inline paragraphs that used to
 * carry the counting rule and handoff notes.
 */
export function Callout({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`funnel-callout ${className}`}>
      <p className="funnel-callout-label">{label}</p>
      <div className="text-[0.9375rem] leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}

/**
 * Standard step footer: hairline rule, plain underlined Back on the left, one
 * orange primary on the right.
 */
export function StepFooter({
  back,
  children,
  above,
}: {
  back?: React.ReactNode;
  children: React.ReactNode;
  above?: React.ReactNode;
}) {
  return (
    <div className="funnel-footer">
      {above}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <div className="order-2 sm:order-1">{back}</div>
        <div className="order-1 w-full sm:order-2 sm:w-auto">{children}</div>
      </div>
    </div>
  );
}
