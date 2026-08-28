/**
 * Coordinates for the location pages that carried none.
 *
 * WHERE THESE CAME FROM
 * OpenStreetMap via the Nominatim API, queried once and recorded here — the
 * same data source the site's own Leaflet maps already render from. Nothing is
 * written from memory: a fabricated latitude puts a claimed business location
 * at a place it is not, which is worse than the 86 pages that previously
 * emitted no GeoCoordinates at all.
 *
 * HOW THEY WERE VALIDATED
 * Nominatim falls back to the CITY centre when it cannot find a neighbourhood,
 * which would have given ~30 Edmonton pages the same downtown pin while looking
 * like a successful geocode. So every result had to (a) return a place whose
 * name matches the one asked for, and (b) land inside a bounding box for its
 * region. The set was then checked for duplicate pins (0), distance from the
 * relevant city centre (max 53.5 km — High River, which is genuinely that far),
 * and isolation from sibling neighbourhoods (none). Edmonton's Inglewood
 * correctly resolved to 53.56, not Calgary's at 51.04.
 *
 * TWO ENTRIES WORTH KNOWING ABOUT
 * Black Diamond and Turner Valley amalgamated into the Town of Diamond Valley
 * in 2023, so OSM no longer carries either as a settlement. Both matched their
 * post office, which sits in the built-up core of each former town. They are
 * 3.4 km apart, which is the real separation of the two communities — better
 * than pinning both pages at the amalgamated centroid and making them
 * identical. If the site ever stops treating them as separate places, revisit.
 *
 * The other 67 location pages carry coordinates inline at their call sites and
 * are untouched by this file.
 */

export interface LatLon {
  latitude: string;
  longitude: string;
}

/** Canonical path (no trailing slash) -> coordinates. */
export const LOCATION_GEO: Readonly<Record<string, LatLon>> = {
  "/cleaning-services-airdrie": { latitude: "51.28597", longitude: "-114.01062" }, // city: Airdrie
  "/cleaning-services-beaumont": { latitude: "53.35255", longitude: "-113.41514" }, // town: Beaumont
  "/cleaning-services-cochrane": { latitude: "51.18746", longitude: "-114.47107" }, // town: Town of Cochrane
  "/cleaning-services-devon": { latitude: "53.36335", longitude: "-113.73170" }, // town: Devon
  "/cleaning-services-fort-saskatchewan": { latitude: "53.71286", longitude: "-113.21489" }, // city: Fort Saskatchewan
  "/cleaning-services-leduc": { latitude: "53.26078", longitude: "-113.55117" }, // city: City of Leduc
  "/cleaning-services-morinville": { latitude: "53.80093", longitude: "-113.65066" }, // town: Morinville
  "/cleaning-services-sherwood-park": { latitude: "53.52570", longitude: "-113.29663" }, // city: Sherwood Park
  "/cleaning-services-spruce-grove": { latitude: "53.54520", longitude: "-113.90350" }, // city: City of Spruce Grove
  "/cleaning-services-st-albert": { latitude: "53.63324", longitude: "-113.62884" }, // city: St. Albert
  "/cleaning-services-stony-plain": { latitude: "53.52899", longitude: "-114.00487" }, // town: Stony Plain
  "/cleaning-services-windermere": { latitude: "53.42324", longitude: "-113.61678" }, // suburb: Windermere
  "/locations/allendale": { latitude: "53.50230", longitude: "-113.50495" }, // neighbourhood: Allendale
  "/locations/balwin-edmonton": { latitude: "53.58834", longitude: "-113.45468" }, // neighbourhood: Balwin
  "/locations/bannerman": { latitude: "53.60372", longitude: "-113.37908" }, // neighbourhood: Bannerman
  "/locations/bellevue-edmonton": { latitude: "53.56474", longitude: "-113.44485" }, // neighbourhood: Bellevue
  "/locations/black-diamond": { latitude: "50.68875", longitude: "-114.23867" }, // amenity: Black Diamond Post Office
  "/locations/capilano-edmonton": { latitude: "53.55446", longitude: "-113.42384" }, // neighbourhood: Capilano
  "/locations/castle-downs": { latitude: "53.62154", longitude: "-113.52510" }, // suburb: Castle Downs
  "/locations/chestermere": { latitude: "51.05273", longitude: "-113.82525" }, // town: Chestermere
  "/locations/clareview": { latitude: "53.60014", longitude: "-113.38673" }, // suburb: Clareview
  "/locations/crossfield": { latitude: "51.42727", longitude: "-114.03099" }, // town: Town of Crossfield
  "/locations/delton": { latitude: "53.57902", longitude: "-113.48242" }, // neighbourhood: Delton
  "/locations/eaux-claires-edmonton": { latitude: "53.62146", longitude: "-113.48592" }, // neighbourhood: Eaux Claires
  "/locations/garneau": { latitude: "53.51964", longitude: "-113.51425" }, // neighbourhood: Garneau
  "/locations/glastonbury": { latitude: "53.50333", longitude: "-113.66989" }, // neighbourhood: Glastonbury
  "/locations/glenora-edmonton": { latitude: "53.54521", longitude: "-113.55580" }, // neighbourhood: Glenora
  "/locations/griesbach-edmonton": { latitude: "53.60676", longitude: "-113.50440" }, // neighbourhood: Griesbach
  "/locations/hazeldean": { latitude: "53.50423", longitude: "-113.47734" }, // neighbourhood: Hazeldean
  "/locations/high-river": { latitude: "50.58019", longitude: "-113.87093" }, // town: High River
  "/locations/inglewood": { latitude: "53.56446", longitude: "-113.54071" }, // neighbourhood: Inglewood
  "/locations/lago-lindo-edmonton": { latitude: "53.63645", longitude: "-113.48584" }, // neighbourhood: Lago Lindo
  "/locations/langdon": { latitude: "50.97443", longitude: "-113.67936" }, // hamlet: Langdon
  "/locations/larkspur-edmonton": { latitude: "53.47984", longitude: "-113.38395" }, // neighbourhood: Larkspur
  "/locations/laurel-edmonton": { latitude: "53.44626", longitude: "-113.38182" }, // neighbourhood: Laurel
  "/locations/lewis-estates": { latitude: "53.52283", longitude: "-113.67868" }, // quarter: Lewis Estates
  "/locations/londonderry": { latitude: "53.60681", longitude: "-113.45667" }, // quarter: Londonderry
  "/locations/maple-ridge-edmonton": { latitude: "53.59314", longitude: "-113.44207" }, // residential: Maple Ridge
  "/locations/mcconachie-edmonton": { latitude: "53.63504", longitude: "-113.43013" }, // neighbourhood: McConachie
  "/locations/montrose": { latitude: "53.57436", longitude: "-113.44173" }, // neighbourhood: Montrose
  "/locations/northmount-edmonton": { latitude: "53.60316", longitude: "-113.47982" }, // neighbourhood: Northmount
  "/locations/okotoks": { latitude: "50.72537", longitude: "-113.97508" }, // town: Okotoks
  "/locations/old-strathcona": { latitude: "53.51542", longitude: "-113.49461" }, // city_block: Old Strathcona
  "/locations/riverbend": { latitude: "53.47490", longitude: "-113.58021" }, // suburb: Riverbend
  "/locations/rosslyn-edmonton": { latitude: "53.59573", longitude: "-113.50529" }, // neighbourhood: Rosslyn
  "/locations/schonsee-edmonton": { latitude: "53.63215", longitude: "-113.45473" }, // neighbourhood: Schonsee
  "/locations/spruce-avenue": { latitude: "53.56440", longitude: "-113.49842" }, // neighbourhood: Spruce Avenue
  "/locations/tamarack-edmonton": { latitude: "53.46667", longitude: "-113.36211" }, // neighbourhood: Tamarack
  "/locations/terwillegar": { latitude: "53.45095", longitude: "-113.57342" }, // suburb: Terwillegar Heights
  "/locations/turner-valley": { latitude: "50.67417", longitude: "-114.27927" }, // amenity: Turner Valley Post Office
  "/locations/york-edmonton": { latitude: "53.60287", longitude: "-113.42956" }, // neighbourhood: York
};

/**
 * Coordinates for a location path, or undefined when we have none.
 *
 * Undefined is a real answer: buildLocationSchema omits the geo property
 * entirely rather than emitting an empty or guessed one.
 */
export function geoFor(path: string): LatLon | undefined {
  const clean = (path.startsWith("http") ? new URL(path).pathname : path).replace(/\/+$/, "");
  return LOCATION_GEO[clean];
}
