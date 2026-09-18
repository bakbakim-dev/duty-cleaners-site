interface RecurringDiscountCardProps {
  percentage: string;
  title: string;
  savings?: string;
  isPopular?: boolean;
}

/**
 * One row of the recurring-discount list: render it inside a <ul>. It used to
 * be a navy card with its own "Get Started" button; three of them opened the
 * same funnel as every other button on the page, so the section now carries
 * one "See My Instant Price" button and these rows carry none.
 */
const RecurringDiscountCard = ({ percentage, title, savings, isPopular = false }: RecurringDiscountCardProps) => (
  <li className="flex items-baseline justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
    <div>
      <h3 className="text-lg font-semibold text-foreground">
        {title}
        {isPopular && (
          <span className="ml-3 align-middle rounded-full bg-brand-navy px-3 py-0.5 text-xs font-semibold text-white">
            Most popular
          </span>
        )}
      </h3>
      {savings && <p className="mt-1 text-sm text-muted-foreground">{savings}</p>}
    </div>
    <p className="shrink-0 text-foreground">
      <span className="text-3xl font-bold">{percentage}</span>{" "}
      <span className="text-base font-semibold">off</span>
    </p>
  </li>
);

export default RecurringDiscountCard;
