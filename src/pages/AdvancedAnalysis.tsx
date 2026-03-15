import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { AdvancedChart } from "@/components/AdvancedChart";
import { toast } from "sonner";

interface FilterState {
  fuelType: string;
  province: string;
  city: string;
  brand: string;
  stationId: string;
  dateRange: string;
}

const AdvancedAnalysis = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    fuelType: 'gasolina95',
    province: 'all',
    city: 'all',
    brand: 'all',
    stationId: 'all',
    dateRange: '1y'
  });

  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    cities: [],
    brands: [],
    stations: []
  });

  // Load initial filter options (provinces and brands)
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/api/fuel-prices/filter-options');
        if (!response.ok) throw new Error('Error al cargar opciones');
        const data = await response.json();
        setFilterOptions(prev => ({
          ...prev,
          provinces: data.provinces,
          brands: data.brands
        }));
      } catch (error) {
        console.error('Error loading filter options:', error);
        toast.error('Error al cargar opciones de filtros');
      }
    };

    loadFilterOptions();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (filters.province !== 'all') {
      const loadCities = async () => {
        try {
          const response = await fetch(`/api/fuel-prices/cities/${encodeURIComponent(filters.province)}`);
          if (!response.ok) throw new Error('Error al cargar ciudades');
          const cities = await response.json();
          setFilterOptions(prev => ({ ...prev, cities }));
        } catch (error) {
          console.error('Error loading cities:', error);
          toast.error('Error al cargar ciudades');
        }
      };

      loadCities();
    } else {
      setFilterOptions(prev => ({ ...prev, cities: [], stations: [] }));
    }
  }, [filters.province]);

  // Load stations when city changes
  useEffect(() => {
    if (filters.city !== 'all') {
      const loadStations = async () => {
        try {
          const url = filters.brand !== 'all'
            ? `/api/fuel-prices/stations/${encodeURIComponent(filters.city)}?brand=${encodeURIComponent(filters.brand)}`
            : `/api/fuel-prices/stations/${encodeURIComponent(filters.city)}`;

          const response = await fetch(url);
          if (!response.ok) throw new Error('Error al cargar estaciones');
          const stations = await response.json();
          setFilterOptions(prev => ({ ...prev, stations }));
        } catch (error) {
          console.error('Error loading stations:', error);
          toast.error('Error al cargar estaciones');
        }
      };

      loadStations();
    } else {
      setFilterOptions(prev => ({ ...prev, stations: [] }));
    }
  }, [filters.city, filters.brand]);

  // Load chart data when filters change
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);

      try {
        const dateRanges: { [key: string]: number } = {
          '6m': 180,
          '1y': 365,
          '2y': 730,
          '3y': 1095
        };

        const params = new URLSearchParams({
          fuelType: filters.fuelType,
          days: dateRanges[filters.dateRange].toString()
        });

        if (filters.province !== 'all') params.append('province', filters.province);
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.brand !== 'all') params.append('brand', filters.brand);
        if (filters.stationId !== 'all') params.append('stationId', filters.stationId);

        const response = await fetch(`/api/fuel-prices/station-history?${params}`);
        if (!response.ok) throw new Error('Error al cargar datos');

        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
        toast.error('Error al cargar datos del gráfico');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Análisis Avanzado de Precios
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Explora Precios por Ubicación</h2>
          <p className="text-muted-foreground">
            Filtra por provincia, ciudad, marca o gasolinera específica para ver tendencias históricas detalladas
          </p>
        </div>

        <AdvancedFilters
          filters={filters}
          onFilterChange={setFilters}
          filterOptions={filterOptions}
        />

        <AdvancedChart
          data={chartData}
          isLoading={isLoading}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default AdvancedAnalysis;
