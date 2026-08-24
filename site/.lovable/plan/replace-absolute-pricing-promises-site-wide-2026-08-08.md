# Replace absolute pricing promises site-wide

Remove wording that implies every quote is unconditionally final or that pricing changes are always settled before cleaning begins. Replace it with neutral, accurate language about the selected cleaning scope, while mentioning condition-based adjustments only as an exception when they genuinely apply.

## User-facing changes
- Update the shared “How Pricing Works” formula:
  - Change the intro to explain that the estimate is shaped by clear service factors.
  - Rename “Clear Communication” to “Service Scope” and describe the rooms, tasks, and add-ons selected for the visit.
  - Replace “Your Confirmed Price” with “Your Cleaning Plan” and describe a clear service outline built around the home’s size and requested priorities.
- Audit and revise related pricing copy on all pages so it does not promise “what we quote is exactly what you pay,” “no surprises,” a guaranteed flat price, or approval of updates before work begins.
- Keep accurate transparency claims such as no trip fees or diagnostic fees where they are confirmed, without suggesting that price changes are routine.
- Update the FAQ so it explains that additional charges may apply only when a home’s actual condition requires substantially more time, and that the team will explain the situation and available options if that exception occurs.
- Preserve the existing visual design, pricing tables, brand colors, and page structure.

## Technical details
- Update `src/components/PricingFormula.tsx` and matching pricing/service/FAQ copy identified by the audit, including the city pricing pages, city overview pages, premium city pages, and `ServiceDetailPage`.
- Remove “before work begins” wording without replacing it with a promise of ongoing price updates or customer approval for every booking.
- Re-scan `src` after editing for the rejected absolute claims and verify the replacement language is neutral, scope-focused, and exception-based.
