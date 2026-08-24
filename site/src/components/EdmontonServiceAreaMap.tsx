import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createPinIcon = (size: "large" | "small", color: string) => {
  // Rendered size is kept at/above 24px so each pin clears WCAG 2.2 target size;
  // the artwork keeps its original viewBox and simply scales up.
  const vw = size === "large" ? 32 : 20;
  const vh = size === "large" ? 44 : 28;
  const w = size === "large" ? 32 : 26;
  const h = size === "large" ? 44 : 36;
  const r = size === "large" ? 12 : 7;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}">
    <path d="${size === "large"
      ? `M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z`
      : `M10 0C4.48 0 0 4.48 0 10c0 7.5 10 18 10 18s10-10.5 10-18C20 4.48 15.52 0 10 0z`
    }" fill="${color}" stroke="#fff" stroke-width="${size === "large" ? 2 : 1.5}"/>
    <circle cx="${vw / 2}" cy="${size === "large" ? 14 : 9}" r="${r}" fill="#fff" opacity="0.9"/>
    <circle cx="${vw / 2}" cy="${size === "large" ? 14 : 9}" r="${r - 3}" fill="${color}"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
};


const majorIcon = createPinIcon("large", "#1a365d");
const minorIcon = createPinIcon("small", "#2b6cb0");

interface LocationPin {
  name: string;
  lat: number;
  lng: number;
  major?: boolean;
}

const locations: LocationPin[] = [
  { name: "Edmonton", lat: 53.5461, lng: -113.4938, major: true },
  { name: "St. Albert", lat: 53.6301, lng: -113.6258 },
  { name: "Sherwood Park", lat: 53.5413, lng: -113.3187 },
  { name: "Spruce Grove", lat: 53.5451, lng: -113.9001 },
  { name: "Leduc", lat: 53.2645, lng: -113.5491 },
  { name: "Beaumont", lat: 53.3572, lng: -113.4147 },
  { name: "Fort Saskatchewan", lat: 53.7123, lng: -113.2133 },
  { name: "Stony Plain", lat: 53.5261, lng: -114.0029 },
  { name: "Morinville", lat: 53.8022, lng: -113.6497 },
  { name: "Devon", lat: 53.3631, lng: -113.7300 },
  { name: "Windermere", lat: 53.4350, lng: -113.5600 },
];

export default function EdmontonServiceAreaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [53.5461, -113.4938],
      zoom: 10,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    locations.forEach((loc) => {
      L.marker([loc.lat, loc.lng], {
        icon: loc.major ? majorIcon : minorIcon,
        // Pins are decorative: the same list is exposed as text below the map,
        // so they stay out of the tab order instead of shipping sub-24px targets.
        interactive: false,
        keyboard: false,
        alt: `${loc.name} service area`,
        title: `${loc.name} service area`,
      })
        .addTo(map)
        .bindPopup(`<strong>${loc.name}</strong>`);
    });

    const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.stop();
      map.off();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl z-0"
        style={{ background: "#e5e7eb" }}
      />
      <ul className="sr-only">
        {locations.map((loc) => (
          <li key={loc.name}>{loc.name} service area</li>
        ))}
      </ul>
    </>
  );
}
