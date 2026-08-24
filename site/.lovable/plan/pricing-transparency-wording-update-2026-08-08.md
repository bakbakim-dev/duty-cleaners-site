# Pricing transparency wording update

Replace the overly absolute pricing promise in the shared “How Pricing Works” formula with a truthful communication-focused step.

## User-facing changes
- Rename step 05 from “No Hidden Fees” to “Clear Communication”.
- Use copy that explains that if the home’s actual condition requires additional time, the team will explain the reason and review any adjustment with the customer before proceeding.
- Update the final result tile so it does not promise an unconditional flat price; it will communicate that the service scope and price are confirmed with the customer before work begins.
- Preserve the existing visual styling, brand colors, formula layout, icons, numbering, and both city-page integrations.

## Technical details
- Update the shared `PricingFormula` component only, since it is used by both Edmonton and Calgary pricing pages.
- Verify the old “What we quote is exactly what you pay” and “no surprises on cleaning day” wording is no longer rendered in this formula section.
- Keep the existing pricing disclaimer and other page content unchanged unless it is directly part of this formula component.
