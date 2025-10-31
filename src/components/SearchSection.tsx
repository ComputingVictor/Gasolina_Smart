import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SearchSectionProps {
  onGeolocate: () => void;
  onSearch: (address: string) => void;
  isLoading: boolean;
}

export const SearchSection = ({ onGeolocate, onSearch, isLoading }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Por favor, introduce una ubicación");
      return;
    }
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section id="buscar" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              Comienza a ahorrar
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Busca gasolineras cerca de ti o introduce una ubicación
            </p>

            <div className="space-y-4">
              {/* Geolocation button */}
              <Button
                size="lg"
                onClick={onGeolocate}
                disabled={isLoading}
                className="w-full text-lg py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_30px_hsl(263_70%_60%_/_0.4)] hover:shadow-[0_0_40px_hsl(263_70%_60%_/_0.6)] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5 mr-2" />
                    Usar mi ubicación actual
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">
                    O busca por dirección
                  </span>
                </div>
              </div>

              {/* Search input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Ciudad, código postal o dirección..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 h-14 px-6 text-lg rounded-xl glass border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-8 py-6 rounded-xl glass hover:bg-white/10 border border-white/20"
                  variant="outline"
                >
                  <Search className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Buscar</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};