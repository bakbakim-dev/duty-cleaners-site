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
  { name: "Calgary", lat: 51.0447, lng: -114.0719, major: true },
  { name: "Airdrie", lat: 51.2917, lng: -114.0144 },
  { name: "Black Diamond", lat: 50.6917, lng: -114.2352 },
  { name: "Chestermere", lat: 51.0501, lng: -113.8228 },
  { name: "Cochrane", lat: 51.1895, lng: -114.4670 },
  { name: "Crossfield", lat: 51.4327, lng: -114.0300 },
  { name: "High River", lat: 50.5843, lng: -113.8687 },
  { name: "Langdon", lat: 51.0340, lng: -113.7315 },
  { name: "Okotoks", lat: 50.7250, lng: -113.9752 },
  { name: "Strathmore", lat: 51.0378, lng: -113.4001 },
  { name: "Turner Valley", lat: 50.6817, lng: -114.2805 },
];

export default function CalgaryServiceAreaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [51.0447, -114.0719],
      zoom: 9,
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
