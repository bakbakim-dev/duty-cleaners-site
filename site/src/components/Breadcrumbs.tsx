import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { resolvedLinkPath } from "@/data/legacy-urls";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route to breadcrumb mapping
const routeLabels: Record<string, string> = {
  "": "Home",
  "edmonton": "Edmonton",
  "calgary": "Calgary",
  "locations": "Locations",
  "about": "About Us",
  "contact": "Contact",
  "reviews": "Reviews",
  "faq": "FAQ",
  "blog": "Blog",
  "join-the-team": "Join the Team",
  "whats-included": "What's Included",
  "services": "Services",
  "pricing": "Pricing",
  "move-in-move-out-cleaning": "Move In/Out Cleaning",
  "march-out-cleaning": "March Out Cleaning",
  "post-construction-cleaning": "Post Construction",
  "airbnb-cleaning": "Airbnb Cleaning",
  "wall-washing": "Wall Washing",
  "gift-cards": "Gift Cards",
  "gift-card": "Gift Card",
  "prepare": "Getting Ready for Your Clean",
  "commercial-cleaning": "Commercial Cleaning",
};

/**
 * Ancestor paths that exist only as a `<Navigate>` route, so they are not in
 * legacy-urls.ts and `resolvedLinkPath` cannot map them. Breadcrumb slicing
 * still produces them (e.g. /edmonton/deep-cleaning yields an "/edmonton"
 * crumb), and linking there costs a redirect hop on every page under it.
 */
const ANCESTOR_OVERRIDES: Record<string, string> = {
  "/edmonton": "/", // the Edmonton city root IS the homepage
};

// Generate breadcrumbs from current path
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Format label - check mapping or format from segment
    let label =
      routeLabels[segment] ||
      formatSegment(segment, breadcrumbs.map((b) => b.label));
    
    breadcrumbs.push({
      label,
      // Ancestor crumbs must point at the canonical URL — /calgary and
      // /edmonton both 301, so an unresolved crumb sends every breadcrumb
      // click (and the BreadcrumbList schema) through a redirect.
      href: isLast
        ? undefined
        : ANCESTOR_OVERRIDES[currentPath] ?? resolvedLinkPath(currentPath),
    });
  });
  
  return breadcrumbs;
}

/**
 * Proper-noun casing that simple word-capitalisation gets wrong. Only the names
 * that actually exist as routes on this site are listed — a general "Mc" rule
 * would mangle unrelated words.
 */
const PROPER_CASE: Record<string, string> = {
  Mcconachie: "McConachie",
  Mccauley: "McCauley",
  Mcleod: "McLeod",
  Mcdougall: "McDougall",
};

// Format segment to readable label
function formatSegment(segment: string, precedingLabels: string[] = []): string {
  const words = segment
    .split("-")
    .map((word) => {
      const cased = word.charAt(0).toUpperCase() + word.slice(1);
      return PROPER_CASE[cased] ?? cased;
    });

  // Drop a trailing city name ONLY when an earlier crumb already established it
  // (e.g. Locations > Calgary > Varsity). On a top-level legacy URL such as
  // /cleaning-services-calgary there is no parent city crumb, and stripping it
  // produced the geo-less "Cleaning Services" — losing the qualifier from both
  // the visible trail and the BreadcrumbList schema on the highest-traffic
  // Calgary pages.
  const filtered = words.filter((word, i) => {
    const isCity = word === "Edmonton" || word === "Calgary";
    if (!isCity) return true;
    if (i === 0) return true; // "Edmonton Pricing" — keep the leading city
    return !precedingLabels.some((l) => l.includes(word));
  });

  return (filtered.length ? filtered : words).join(" ").trim();
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);
  
  // Don't show breadcrumbs on home page
  if (location.pathname === "/" || breadcrumbItems.length <= 1) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://dutycleaners.ca${item.href ?? location.pathname}`,
    })),
  };

  return (
    <Breadcrumb className={className}>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          // Separator is its own <li>; nesting it inside an item broke list markup.
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
            {item.href ? (
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
