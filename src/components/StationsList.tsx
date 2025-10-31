import { motion } from "framer-motion";
import { StationCard } from "./StationCard";
import { MapPin } from "lucide-react";

interface Station {
  id: string;
  name: string;
  address: string;
  price: number;
  distance?: number;
  schedule?: string;
  brand?: string;
  lat: number;
  lng: number;
}

interface StationsListProps {
  stations: Station[];
  onNavigate: (station: Station) => void;
}

export const StationsList = ({ stations, onNavigate }: StationsListProps) => {
  if (stations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-3xl p-12 text-center border border-white/10"
      >
        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">No se encontraron gasolineras</h3>
        <p className="text-muted-foreground">
          Intenta ampliar el radio de búsqueda o cambiar la ubicación
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold">
          {stations.length} gasolinera{stations.length !== 1 ? 's' : ''} encontrada{stations.length !== 1 ? 's' : ''}
        </h2>
      </motion.div>

      {stations.map((station, index) => (
        <StationCard
          key={station.id}
          station={station}
          index={index}
          onNavigate={() => onNavigate(station)}
          allStations={stations}
        />
      ))}
    </div>
  );
};