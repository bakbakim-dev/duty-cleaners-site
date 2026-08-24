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

export default function SpruceAvenueMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [53.565, -113.49],
      zoom: 13,
      scrollWheelZoom: false,
    });

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([53.565, -113.49], { icon })
      .addTo(map)
      .bindPopup("<strong>Spruce Avenue, Edmonton</strong>")
      .openPopup();

    return () => {
      map.stop();
      map.off();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] z-0 rounded-2xl"
      style={{ background: "#e5e7eb" }}
    />
  );
}
