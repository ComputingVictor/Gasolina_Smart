import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
}

interface MapComponentProps {
  stations: Station[];
  center: [number, number];
  zoom?: number;
  radius?: number;
}

export const MapComponent = ({ stations, center, zoom = 13, radius = 10 }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, []);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom);
  }, [center, zoom]);

  // Update markers and overlays when data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // Ignore errors if marker already removed
      }
    });
    markersRef.current = [];

    // Clear existing circle
    if (circleRef.current) {
      try {
        circleRef.current.remove();
      } catch (e) {
        // Ignore errors if circle already removed
      }
    }

    // Clear existing user location marker
    if (userLocationMarkerRef.current) {
      try {
        userLocationMarkerRef.current.remove();
      } catch (e) {
        // Ignore errors if marker already removed
      }
    }

    // Add radius circle (radar effect)
    circleRef.current = L.circle(center, {
      radius: radius * 1000, // Convert km to meters
      color: 'hsl(263, 70%, 60%)', // Primary color
      fillColor: 'hsl(263, 70%, 60%)',
      fillOpacity: 0.1,
      opacity: 0.3,
      weight: 2,
    }).addTo(mapRef.current);

    // Create custom icon for user location
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add user location marker
    userLocationMarkerRef.current = L.marker(center, { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg" style="color: #3b82f6">Tu ubicación</h3>
        </div>
      `);

    // Add new station markers
    stations.forEach((station) => {
      if (mapRef.current) {
        const marker = L.marker([station.lat, station.lng])
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg mb-1">${station.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${station.address}</p>
              <div class="text-2xl font-bold" style="color: hsl(263, 70%, 60%)">
                ${station.price.toFixed(3)}€/L
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });
  }, [stations, center, radius]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={containerRef} className="h-[500px] md:h-[600px] w-full" />
    </div>
  );
};