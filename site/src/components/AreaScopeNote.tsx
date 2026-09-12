import { Link, useLocation } from "react-router-dom";

type Scope = { heading: string; text: string; links: [string, string][] };

/** Editorial geography, not new service boundaries. Sources and held decisions are in docs/editing-brief-implementation.md. */
const SCOPES: Record<string, Scope> = {
  "/locations/kensington/": {
    heading: "Kensington district and neighbourhood coverage",
    text: "Kensington is the business district name, not a replacement for the Hillhurst and Sunnyside neighbourhood names. Use the neighbourhood pages for your home, and give the office the actual address when booking.",
    links: [["Hillhurst house cleaning", "/locations/hillhurst-calgary/"], ["Sunnyside house cleaning", "/locations/sunnyside-calgary/"]],
  },
  "/locations/marda-loop/": {
    heading: "Marda Loop and nearby neighbourhoods",
    text: "Marda Loop is a district name. It should not be used interchangeably with Altadore or Richmond, which have their own neighbourhood pages. Choose the page relevant to your address; district names do not create a different cleaning package.",
    links: [["Altadore house cleaning", "/locations/altadore-calgary/"], ["Richmond house cleaning", "/locations/richmond-calgary/"]],
  },
  "/locations/beltline-calgary/": {
    heading: "Beltline overview and Victoria Park",
    text: "This page covers the broader Beltline area. For the Victoria Park part of the Beltline, use the more focused area page. Confirm entry, parking and any building-specific arrangements for your own address.",
    links: [["House cleaning in the Victoria Park area", "/locations/victoria-park-calgary/"]],
  },
  "/locations/victoria-park-calgary/": {
    heading: "Victoria Park within the Beltline",
    text: "This page focuses on the Victoria Park area, not the whole Beltline. The broader area page is available if that better describes your address. Ask your building about access rather than assuming every nearby condo has the same requirements.",
    links: [["Beltline house cleaning overview", "/locations/beltline-calgary/"]],
  },
  "/locations/west-calgary/": {
    heading: "Browse west Calgary coverage",
    text: "West Calgary is a broad coverage label on this site, not a single neighbourhood or the Downtown West End. Start with an existing neighbourhood page below, or ask the Calgary office to confirm your address.",
    links: [["Aspen Woods", "/locations/aspen-woods/"], ["Spruce Cliff", "/locations/spruce-cliff-calgary/"], ["Wildwood", "/locations/wildwood-calgary/"], ["Downtown West End — a different area", "/locations/downtown-west-end-calgary/"]],
  },
  "/locations/sunalta-west-calgary/": {
    heading: "Scarboro / Sunalta West naming",
    text: "The City of Calgary calls this community Scarboro/Sunalta West. It is not the same community as Sunalta or Scarboro. This existing Sunalta West URL stays in place; use the other pages when they match your address.",
    links: [["Sunalta house cleaning", "/locations/sunalta-calgary/"], ["Scarboro house cleaning", "/locations/scarboro-calgary/"]],
  },
  "/locations/mount-royal/": {
    heading: "Upper and Lower Mount Royal",
    text: "Upper Mount Royal and Lower Mount Royal are separately named Calgary communities. This Mount Royal overview currently discusses both; the Lower Mount Royal page gives the more specific destination for an address there.",
    links: [["Lower Mount Royal house cleaning", "/locations/lower-mount-royal-calgary/"]],
  },
  "/locations/black-diamond/": {
    heading: "Black Diamond area of Diamond Valley",
    text: "Black Diamond and Turner Valley now form the Town of Diamond Valley. This page serves customers looking for the historical Black Diamond area; the Turner Valley area has its own existing page. Both are served by the Calgary branch, with the applicable travel fee shown below.",
    links: [["Turner Valley area, Diamond Valley", "/locations/turner-valley/"]],
  },
  "/locations/turner-valley/": {
    heading: "Turner Valley area of Diamond Valley",
    text: "This page is for the historical Turner Valley area of the Town of Diamond Valley. For a home in the Black Diamond area, use that area page. These are coverage pages for the Calgary branch, not two additional branch offices.",
    links: [["Black Diamond area, Diamond Valley", "/locations/black-diamond/"]],
  },
  "/locations/castle-downs/": {
    heading: "Using the Castle Downs coverage page",
    text: "Castle Downs is used here as an area-wide coverage name, not a claim that every home belongs to one neighbourhood. Give the Edmonton office your address and the name of your neighbourhood; the city coverage directory helps you find a more specific page where one exists.",
    links: [["Browse Edmonton neighbourhood coverage", "/locations/"]],
  },
  "/locations/clareview/": {
    heading: "Clareview area coverage",
    text: "This is the broader Clareview coverage page, not a separate page for every neighbourhood around the town centre. Use your actual address when booking. A nearby station or district name alone does not identify the building's access arrangements.",
    links: [["Browse Edmonton neighbourhood coverage", "/locations/"]],
  },
  "/locations/hermitage-edmonton/": {
    heading: "Hermitage coverage and your address",
    text: "Hermitage is an area label on this site. It is not a claim that all homes around the park share one layout or cleaning need. Use the Edmonton coverage directory for more specific neighbourhood pages and describe your own home when requesting a quote.",
    links: [["Browse Edmonton neighbourhood coverage", "/locations/"]],
  },
};

export default function AreaScopeNote() {
  const { pathname } = useLocation();
  const scope = SCOPES[pathname.replace(/\/+$/, "") + "/"];
  if (!scope) return null;
  return (
    <aside className="max-w-3xl mx-auto px-4 py-8 border-b border-border" aria-label="Area coverage clarification">
      <h2 className="text-2xl font-bold mb-3">{scope.heading}</h2>
      <p className="text-muted-foreground leading-relaxed">{scope.text}</p>
      <ul className="mt-4 space-y-2">
        {scope.links.map(([label, to]) => <li key={to}><Link className="text-primary underline underline-offset-2" to={to}>{label}</Link></li>)}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">Service-area pages describe where our branch travels, not additional staffed offices.</p>
    </aside>
  );
}
