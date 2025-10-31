import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Fuel, Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrandLogo } from "@/lib/brandLogos";
import { SavingsCalculator } from "@/components/SavingsCalculator";

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
  allStations?: Array<{
    id: string;
    name: string;
    address: string;
    price: number;
    distance?: number;
    schedule?: string;
    brand?: string;
  }>;
}

export const StationCard = ({ station, index, onNavigate, allStations = [] }: StationCardProps) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const logo = getBrandLogo(station.brand);

  if (import.meta.env.DEV) {
    console.debug('StationCard brand resolve', { brand: station.brand, logo });
  }

  const closestStation = allStations.length > 0
    ? allStations.reduce((prev, current) =>
        (prev.distance || 0) < (current.distance || 0) ? prev : current
      )
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex flex-col gap-4">
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
                  loading="lazy"
                  decoding="async"
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

        {/* Calculator Toggle */}
        {allStations.length > 1 && (
          <div className="border-t border-white/10 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full justify-between hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {showCalculator ? "Ocultar" : "Ver"} calculadora de ahorro
              </span>
              {showCalculator ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            <AnimatePresence>
              {showCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <SavingsCalculator
                      currentStation={station}
                      closestStation={closestStation}
                      allStations={allStations}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};