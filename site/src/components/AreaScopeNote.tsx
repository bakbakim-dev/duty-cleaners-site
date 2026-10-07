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
    text: "West Calgary is a broad area, not a single neighbourhood or the Downtown West End. Start with a neighbourhood page below, or ask the Calgary office to confirm your address.",
    links: [["Aspen Woods", "/locations/aspen-woods/"], ["Spruce Cliff", "/locations/spruce-cliff-calgary/"], ["Wildwood", "/locations/wildwood-calgary/"], ["Downtown West End — a different area", "/locations/downtown-west-end-calgary/"]],
  },
  "/locations/sunalta-west-calgary/": {
    heading: "Scarboro / Sunalta West naming",
    text: "The City of Calgary calls this community Scarboro/Sunalta West. It is not the same community as Sunalta or Scarboro, so if your address is in one of those, their pages below describe it better.",
    links: [["Sunalta house cleaning", "/locations/sunalta-calgary/"], ["Scarboro house cleaning", "/locations/scarboro-calgary/"]],
  },
  "/locations/mount-royal/": {
    heading: "Upper and Lower Mount Royal",
    text: "Upper Mount Royal and Lower Mount Royal are separately named Calgary communities. This page covers both; if your home is in Lower Mount Royal, its own page below says more about it.",
    links: [["Lower Mount Royal house cleaning", "/locations/lower-mount-royal-calgary/"]],
  },
  "/locations/black-diamond/": {
    heading: "Black Diamond area of Diamond Valley",
    text: "Black Diamond and Turner Valley now form the Town of Diamond Valley. This page is about the Black Diamond side of Diamond Valley; the Turner Valley side has its own page. The Calgary branch cleans both, with the travel fee shown below.",
    links: [["Turner Valley area, Diamond Valley", "/locations/turner-valley/"]],
  },
  "/locations/turner-valley/": {
    heading: "Turner Valley area of Diamond Valley",
    text: "This page is about the Turner Valley side of the Town of Diamond Valley; the Black Diamond side has its own page. The Calgary branch cleans both; neither has an office of its own.",
    links: [["Black Diamond area, Diamond Valley", "/locations/black-diamond/"]],
  },
  "/locations/castle-downs/": {
    heading: "Using the Castle Downs coverage page",
    text: "Castle Downs is the name of a wider area made up of several neighbourhoods. Give the Edmonton office your address and your neighbourhood; the list of areas we clean may have a page for it.",
    links: [["Browse Edmonton neighbourhood coverage", "/locations/"]],
  },
  "/locations/clareview/": {
    heading: "Clareview area coverage",
    text: "Clareview is a wider area with several neighbourhoods around the town centre. Give your own address when booking: a nearby station or district name does not tell the team how to get into your building.",
    links: [["Browse Edmonton neighbourhood coverage", "/locations/"]],
  },
  "/locations/hermitage-edmonton/": {
    heading: "Hermitage coverage and your address",
    text: "Hermitage is the name of an area of three neighbourhoods around the park, and the homes vary. The list of areas we clean has the individual neighbourhoods; describe your own home when you ask for a quote.",
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
      <p className="mt-4 text-sm text-muted-foreground">These pages describe where our team travels to clean; there is no office in each area.</p>
    </aside>
  );
}
