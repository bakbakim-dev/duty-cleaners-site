import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
  <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z" fill="#1a365d" stroke="#fff" stroke-width="2"/>
  <circle cx="16" cy="14" r="12" fill="#fff" opacity="0.9"/>
  <circle cx="16" cy="14" r="9" fill="#1a365d"/>
</svg>`;

const icon = L.divIcon({
  html: pinSvg,
  className: "",
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -40],
});

interface LocationMapProps {
  center: [number, number];
  label: string;
  zoom?: number;
}

export default function LocationMap({ center, label, zoom = 13 }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: false,
    });

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(center, {
      icon,
      // Leaflet gives a marker keyboard focus by default and renders it as
      // role="button". Without `alt` it is a focusable control with no
      // accessible name — a screen reader announces "button" and nothing
      // else. The multi-pin service-area maps avoid this by opting out of
      // the tab order entirely (interactive: false, keyboard: false); this
      // marker is the page's one real pin, so it gets a name instead.
      alt: label,
      title: label,
    })
      .addTo(map)
      .bindPopup(`<strong>${label}</strong>`)
      .openPopup();

    return () => {
      map.stop();
      map.off();
      map.remove();
      mapInstance.current = null;
    };
  }, [center, label, zoom]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] z-0 rounded-2xl"
      style={{ background: "#e5e7eb" }}
    />
  );
}
