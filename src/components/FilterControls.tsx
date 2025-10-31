import { motion } from "framer-motion";
import { Filter, TrendingDown, Clock, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterControlsProps {
  fuelType: string;
  onFuelTypeChange: (value: string) => void;
  radius: string;
  onRadiusChange: (value: string) => void;
  brandFilter: string;
  onBrandFilterChange: (value: string) => void;
  scheduleFilter: string;
  onScheduleFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export const FilterControls = ({
  fuelType,
  onFuelTypeChange,
  radius,
  onRadiusChange,
  brandFilter,
  onBrandFilterChange,
  scheduleFilter,
  onScheduleFilterChange,
  sortBy,
  onSortChange,
}: FilterControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-6 border border-white/10 mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Filtros y ordenación</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fuel Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Tipo de combustible
          </label>
          <Select value={fuelType} onValueChange={onFuelTypeChange}>
            <SelectTrigger className="glass border-white/10 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasolina95">Gasolina 95 E5</SelectItem>
              <SelectItem value="gasolina98">Gasolina 98 E5</SelectItem>
              <SelectItem value="gasoleoa">Gasóleo A</SelectItem>
              <SelectItem value="gasoleob">Gasóleo B</SelectItem>
              <SelectItem value="gasoleoplus">Gasóleo Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Radius */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Radio de búsqueda
          </label>
          <Select value={radius} onValueChange={onRadiusChange}>
            <SelectTrigger className="glass border-white/10 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2.5">2.5 km</SelectItem>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="15">15 km</SelectItem>
              <SelectItem value="20">20 km</SelectItem>
              <SelectItem value="30">30 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Ordenar por
          </label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="glass border-white/10 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Precio más bajo</SelectItem>
              <SelectItem value="distance">Distancia</SelectItem>
              <SelectItem value="name">Nombre (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Marca
          </label>
          <Select value={brandFilter} onValueChange={onBrandFilterChange}>
            <SelectTrigger className="glass border-white/10 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              <SelectItem value="repsol">Repsol</SelectItem>
              <SelectItem value="cepsa">Cepsa</SelectItem>
              <SelectItem value="bp">BP</SelectItem>
              <SelectItem value="shell">Shell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Horario
          </label>
          <Select value={scheduleFilter} onValueChange={onScheduleFilterChange}>
            <SelectTrigger className="glass border-white/10 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier horario</SelectItem>
              <SelectItem value="24h">Abiertas 24h</SelectItem>
              <SelectItem value="open">Abiertas ahora</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full h-12 glass border-white/20 hover:bg-white/10"
            onClick={() => {
              onFuelTypeChange("gasolina95");
              onRadiusChange("10");
              onBrandFilterChange("all");
              onScheduleFilterChange("all");
              onSortChange("price");
            }}
          >
            Resetear filtros
          </Button>
        </div>
      </div>
    </motion.div>
  );
};