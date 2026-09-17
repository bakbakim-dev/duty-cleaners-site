/**
 * A "Call" link on a page that belongs to no branch.
 *
 * Those pages used to hard-code the Edmonton number into their hero and CTA
 * buttons, so a visitor who had just chosen Calgary was handed Edmonton's
 * phone on About, FAQs, Reviews and the rest. The same rule as the header
 * (Navigation.tsx) applies here: the remembered office after mount, and
 * before that — which is what the prerender and every crawler see — a link to
 * the footer's three offices, labelled honestly.
 *
 * Renders a plain anchor and forwards className and ref, so it can sit inside
 * <Button asChild> exactly where the old <a href="tel:…"> did.
 */
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { CITY_PROOF } from "@/data/proof";
import { useBranchPreference } from "@/lib/branch-preference";

/** The footer's offices block (Footer.tsx). */
export const OFFICES_ANCHOR = "#offices";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  /** An icon rendered before the label, if the button style uses one. */
  icon?: ReactNode;
};

const OfficeCallLink = forwardRef<HTMLAnchorElement, Props>(function OfficeCallLink({ icon, ...rest }, ref) {
  const branch = useBranchPreference();
  const office = branch ? CITY_PROOF[branch] : null;
  return office ? (
    <a ref={ref} href={office.phoneLink} {...rest}>
      {icon}
      Call {office.phone}
    </a>
  ) : (
    <a ref={ref} href={OFFICES_ANCHOR} {...rest}>
      {icon}
      Call an office
    </a>
  );
});

export default OfficeCallLink;
