import { forwardRef } from "react";

/**
 * Shared chapter heading for every funnel step: the headline and the muted
 * companion line. The progress row above already names and numbers the step,
 * so `number` and `eyebrow` feed only a screen-reader prefix; a visible badge
 * and eyebrow here said the step's name three times. Sans, not display-serif:
 * the serif is for marketing pages, never inside the quote funnel.
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
      <h2
        ref={ref}
        tabIndex={-1}
        className="text-2xl font-bold leading-tight tracking-tight text-foreground focus:outline-none sm:text-[1.75rem]"
      >
        <span className="sr-only">Step {Number(number)}, {eyebrow}: </span>
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
