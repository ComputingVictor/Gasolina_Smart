import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrandLogo } from "@/lib/brandLogos";

interface StationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    price: number;
    distance?: number;
    schedule?: string;
    brand?: string;
  };
  index: number;
  onNavigate: () => void;
}

export const StationCard = ({ station, index, onNavigate }: StationCardProps) => {
  const logo = getBrandLogo(station.brand);
  if (import.meta.env.DEV) {
    console.debug('StationCard brand resolve', { brand: station.brand, logo });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Station info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-4">
            {/* Brand logo */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-lg">
              <img 
                src={logo} 
                alt={station.brand || "Gasolinera"}
                className="w-full h-full object-contain p-1"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                {station.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{station.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {station.distance && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Navigation className="w-4 h-4" />
                <span>{station.distance.toFixed(1)} km</span>
              </div>
            )}
            {station.schedule && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{station.schedule}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and action */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-4xl font-bold text-primary">
              <Fuel className="w-8 h-8" />
              {station.price.toFixed(3)}€
            </div>
            <div className="text-xs text-muted-foreground">por litro</div>
          </div>

          <Button
            size="lg"
            onClick={onNavigate}
            className="rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_hsl(263_70%_60%_/_0.3)] hover:shadow-[0_0_30px_hsl(263_70%_60%_/_0.5)] transition-all"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Ir
          </Button>
        </div>
      </div>
    </motion.div>
  );
};