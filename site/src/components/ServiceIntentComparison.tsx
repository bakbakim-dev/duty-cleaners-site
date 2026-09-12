import { Link } from "react-router-dom";

/** A chooser, not another rate card. Service facts are shared; city routes remain explicit. */
export default function ServiceIntentComparison({ city }: { city: "edmonton" | "calgary" }) {
  const name = city === "edmonton" ? "Edmonton" : "Calgary";
  const rows = [
    { name: "One-time standard cleaning", fit: "Routine upkeep for one visit", scope: "Kitchen surfaces, bathrooms, reachable dusting and floors; microwave inside and out. Oven and fridge interiors are separate add-ons.", basis: "Flat by home size", to: `/${city}/regular-cleaning/` },
    { name: "Recurring cleaning", fit: "Ongoing help on a repeating schedule", scope: "The standard checklist on weekly, biweekly or every-four-weeks visits. Schedule discounts start with visit two.", basis: "Home size and visit frequency", to: `/${city}/recurring-cleaning/` },
    { name: "Deep cleaning", fit: "A visit needing the additional deep-clean tasks", scope: "Standard cleaning plus baseboards, doors, light switches, wall outlets, vent covers and cobwebs. Oven and fridge interiors remain add-ons.", basis: "Home size plus the deep package", to: `/${city}/deep-cleaning/` },
    { name: "Move-in / move-out cleaning", fit: "Preparing an empty home for a handover", scope: "Includes appliance interiors and inside cabinets, drawers and closets. Interior window cleaning and wall washing remain add-ons.", basis: "Flat by home size", to: `/move-out-cleaning-${city}/` },
  ];
  return (
    <section className="py-14 bg-background" aria-labelledby="service-comparison-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 id="service-comparison-heading" className="display-serif text-3xl md:text-4xl font-bold mb-5">Compare the main cleaning options</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {city === "edmonton"
            ? "Choose by the work you need completed and whether this is one visit or an ongoing booking. An Edmonton home does not need a larger package simply because you are booking a cleaner for the first time."
            : "For a Calgary booking, start with the condition of the property and your next step: keeping up with the rooms, arranging regular help or preparing to move. The service name matters less than its written checklist."}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Compare {name} cleaning services by purpose, inclusions and pricing basis</caption>
            <thead className="bg-secondary"><tr>{["Service", "Best fit", "Scope and important limits", "Pricing basis"].map(label => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}</tr></thead>
            <tbody>{rows.map(row => <tr key={row.to} className="border-t border-border"><th scope="row" className="p-4"><Link to={row.to} className="text-primary underline underline-offset-4">{row.name}</Link></th><td className="p-4">{row.fit}</td><td className="p-4 min-w-56">{row.scope}</td><td className="p-4">{row.basis}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div><h3 className="text-xl font-bold mb-3">Standard or deep cleaning?</h3><p className="text-muted-foreground">Choose the deep package when you need its additional tasks. Compare the <Link className="text-primary underline" to="/whats-included/">standard and deep cleaning checklists</Link> before paying for a package you do not need.</p></div>
          <div><h3 className="text-xl font-bold mb-3">Deep cleaning or move-out cleaning?</h3><p className="text-muted-foreground">A handover needs the inside of appliances and storage spaces addressed. Choose <Link className="text-primary underline" to={`/move-out-cleaning-${city}/`}>move-out cleaning in {name}</Link> for that scope. A clean cannot guarantee an inspection result or a returned deposit.</p></div>
          <div><h3 className="text-xl font-bold mb-3">One visit or a recurring schedule?</h3><p className="text-muted-foreground">Choose a single visit for a one-off job, or a schedule for ongoing upkeep. Our <Link className="text-primary underline" to={`/${city}/recurring-cleaning/`}>{name} recurring cleaning plans</Link> explain first-visit and later-visit prices.</p></div>
        </div>
        <p className="mt-8 text-muted-foreground">Compare all home-size tiers and applicable fees on the <Link className="text-primary underline" to={city === "edmonton" ? "/pricing/" : "/calgary/pricing/"}>full {name} price list</Link>. The service cards explain specialist jobs and link to their detailed scope.</p>
      </div>
    </section>
  );
}
