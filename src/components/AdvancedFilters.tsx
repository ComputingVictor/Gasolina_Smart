import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FilterState {
  fuelType: string;
  province: string;
  city: string;
  brand: string;
  stationId: string;
  dateRange: string;
}

interface FilterOptions {
  provinces: string[];
  cities: string[];
  brands: string[];
  stations: { station_id: string; station_name: string; brand: string; address: string }[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filterOptions: FilterOptions;
}

const fuelTypes = [
  { value: 'gasolina95', label: 'Gasolina 95' },
  { value: 'gasolina98', label: 'Gasolina 98' },
  { value: 'gasoleoa', label: 'Gasóleo A' },
  { value: 'gasoleob', label: 'Gasóleo B' },
];

const dateRanges = [
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '1y', label: 'Último año' },
  { value: '2y', label: 'Últimos 2 años' },
  { value: '3y', label: 'Últimos 3 años' },
];

export const AdvancedFilters = ({ filters, onFilterChange, filterOptions }: AdvancedFiltersProps) => {
  const handleReset = () => {
    onFilterChange({
      fuelType: 'gasolina95',
      province: 'all',
      city: 'all',
      brand: 'all',
      stationId: 'all',
      dateRange: '1y'
    });
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };

    // Cascada de filtros
    if (key === 'province') {
      newFilters.city = 'all';
      newFilters.stationId = 'all';
    } else if (key === 'city') {
      newFilters.stationId = 'all';
    }

    onFilterChange(newFilters);
  };

  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Filtros de Búsqueda</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Resetear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de Combustible */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Tipo de Combustible
          </label>
          <Select value={filters.fuelType} onValueChange={(value) => updateFilter('fuelType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona combustible" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel.value} value={fuel.value}>
                  {fuel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provincia */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Provincia
          </label>
          <Select value={filters.province} onValueChange={(value) => updateFilter('province', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las provincias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las provincias</SelectItem>
              {filterOptions.provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ciudad */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Ciudad
          </label>
          <Select
            value={filters.city}
            onValueChange={(value) => updateFilter('city', value)}
            disabled={filters.province === 'all'}
          >
            <SelectTrigger className={filters.province === 'all' ? 'opacity-50' : ''}>
              <SelectValue placeholder={filters.province === 'all' ? 'Selecciona provincia primero' : 'Todas las ciudades'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {filterOptions.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marca */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Marca / Cadena
          </label>
          <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {filterOptions.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gasolinera Específica */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Gasolinera
          </label>
          <Select
            value={filters.stationId}
            onValueChange={(value) => updateFilter('stationId', value)}
            disabled={filters.city === 'all'}
          >
            <SelectTrigger className={filters.city === 'all' ? 'opacity-50' : ''}>
              <SelectValue placeholder={filters.city === 'all' ? 'Selecciona ciudad primero' : 'Todas las gasolineras'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las gasolineras</SelectItem>
              {filterOptions.stations.map((station) => (
                <SelectItem key={station.station_id} value={station.station_id}>
                  {station.station_name} - {station.brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de Tiempo */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Período de Tiempo
          </label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona período" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.province !== 'all' && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            📍 {filters.province}
          </span>
        )}
        {filters.city !== 'all' && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            🏙️ {filters.city}
          </span>
        )}
        {filters.brand !== 'all' && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            ⛽ {filters.brand}
          </span>
        )}
        {filters.stationId !== 'all' && filterOptions.stations.find(s => s.station_id === filters.stationId) && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            🎯 {filterOptions.stations.find(s => s.station_id === filters.stationId)?.station_name}
          </span>
        )}
      </div>
    </div>
  );
};
