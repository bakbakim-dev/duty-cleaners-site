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

// Generate breadcrumbs from current path
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Format label - check mapping or format from segment
    let label = routeLabels[segment] || formatSegment(segment);
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });
  
  return breadcrumbs;
}

// Format segment to readable label
function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Edmonton", "")
    .replace("Calgary", "")
    .trim();
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
