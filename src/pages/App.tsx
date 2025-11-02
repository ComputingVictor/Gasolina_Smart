import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchSection } from "@/components/SearchSection";
import { FilterControls } from "@/components/FilterControls";
import { MapComponent } from "@/components/MapComponent";
import { StationsList } from "@/components/StationsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fetchWithRetry } from "@/lib/fetch-with-retry";

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
const GEOCODING_API = 'https://nominatim.openstreetmap.org/search';

interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  distance?: number;
  schedule?: string;
  brand?: string;
}

const FUEL_FIELD_MAP: Record<string, string> = {
  'gasolina95': 'Precio Gasolina 95 E5',
  'gasolina98': 'Precio Gasolina 98 E5',
  'gasoleoa': 'Precio Gasoleo A',
  'gasoleob': 'Precio Gasoleo B',
  'gasoleoplus': 'Precio Gasoleo Premium'
};

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [allStations, setAllStations] = useState<any[]>([]);
  
  // Filters
  const [fuelType, setFuelType] = useState("gasolina95");
  const [radius, setRadius] = useState("2.5");
  const [brandFilter, setBrandFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const parsePrice = (priceStr: string): number => {
    if (!priceStr || priceStr === '') return 999999;
    return parseFloat(priceStr.replace(',', '.'));
  };

  const fetchStationsData = async () => {
    try {
      const response = await fetchWithRetry(API_URL, {}, 3, 1000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.ListaEESSPrecio || [];
    } catch (error) {
      console.error("Error fetching stations:", error);
      toast.error("Error al cargar los datos de gasolineras. Reintentando...");

      // Reintento manual adicional después de 2 segundos
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(API_URL);
        const data = await response.json();
        toast.success("Datos cargados correctamente");
        return data.ListaEESSPrecio || [];
      } catch (retryError) {
        toast.error("No se pudieron cargar las gasolineras. Por favor, recarga la página.");
        return [];
      }
    }
  };

  const processStations = (rawStations: any[], location: [number, number]) => {
    const fuelField = FUEL_FIELD_MAP[fuelType];
    const maxRadius = parseFloat(radius);

    const processed = rawStations
      .map((station: any) => {
        const lat = parseFloat(station.Latitud.replace(',', '.'));
        const lng = parseFloat(station['Longitud (WGS84)'].replace(',', '.'));
        const price = parsePrice(station[fuelField]);
        const distance = calculateDistance(location[0], location[1], lat, lng);

        return {
          id: station.IDEESS,
          name: station.Rótulo || 'Sin nombre',
          address: `${station.Dirección}, ${station.Localidad}`,
          lat,
          lng,
          price,
          distance,
          schedule: station.Horario || '',
          brand: station.Rótulo?.toLowerCase() || '',
        };
      })
      .filter((station: Station) => {
        // Filtrar estaciones con precios válidos y dentro del radio
        if (station.price >= 999999 || station.distance === undefined || station.distance > maxRadius) {
          return false;
        }

        // Filtrar estaciones de autobuses (plural y singular)
        const name = station.name.toLowerCase();
        const address = station.address.toLowerCase();
        const isBusStation =
          name.includes('estacion de autobuses') ||
          name.includes('estación de autobuses') ||
          name.includes('estacion autobuses') ||
          name.includes('estación autobuses') ||
          name.includes('estacion de autobus') ||
          name.includes('estación de autobus') ||
          name.includes('estacion autobus') ||
          name.includes('estación autobus') ||
          address.includes('estacion de autobuses') ||
          address.includes('estación de autobuses') ||
          address.includes('estacion autobuses') ||
          address.includes('estación autobuses') ||
          address.includes('estacion de autobus') ||
          address.includes('estación de autobus') ||
          address.includes('estacion autobus') ||
          address.includes('estación autobus');

        return !isBusStation;
      });

    // Apply filters
    let filtered = processed;

    if (brandFilter !== 'all') {
      filtered = filtered.filter((s: Station) => s.brand?.includes(brandFilter.toLowerCase()));
    }

    if (scheduleFilter === '24h') {
      filtered = filtered.filter((s: Station) => s.schedule?.toLowerCase().includes('24'));
    }

    // Sort
    filtered.sort((a: Station, b: Station) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        
        const data = await fetchStationsData();
        setAllStations(data);
        
        const processed = processStations(data, location);
        setStations(processed);
        
        setIsLoading(false);
        toast.success(`${processed.length} gasolineras encontradas`);
        scrollToResults();
      },
      (error) => {
        setIsLoading(false);
        toast.error('No se pudo obtener tu ubicación');
      }
    );
  };

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${GEOCODING_API}?q=${encodeURIComponent(address)},España&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        toast.error('No se encontró la ubicación');
        setIsLoading(false);
        return;
      }

      const location: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      setUserLocation(location);
      
      const stationsData = await fetchStationsData();
      setAllStations(stationsData);
      
      const processed = processStations(stationsData, location);
      setStations(processed);
      
      setIsLoading(false);
      toast.success(`${processed.length} gasolineras encontradas`);
      scrollToResults();
    } catch (error) {
      setIsLoading(false);
      toast.error('Error al buscar la ubicación');
    }
  };

  const handleNavigate = (station: Station) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`,
      '_blank'
    );
  };

  // Reprocess when filters change
  useEffect(() => {
    if (userLocation && allStations.length > 0) {
      const processed = processStations(allStations, userLocation);
      setStations(processed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuelType, radius, brandFilter, scheduleFilter, sortBy, userLocation, allStations]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GasolinaSmart
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <div className="pt-20">
        <SearchSection 
          onGeolocate={handleGeolocate}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {userLocation && stations.length > 0 && (
          <div ref={resultsRef} className="container mx-auto px-4 py-20">
            <FilterControls
              fuelType={fuelType}
              onFuelTypeChange={setFuelType}
              radius={radius}
              onRadiusChange={setRadius}
              brandFilter={brandFilter}
              onBrandFilterChange={setBrandFilter}
              scheduleFilter={scheduleFilter}
              onScheduleFilterChange={setScheduleFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <MapComponent
                stations={stations}
                center={userLocation}
                zoom={13}
                radius={parseFloat(radius)}
              />
              <div className="lg:max-h-[600px] lg:overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <StationsList
                  stations={stations}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="py-12 text-center text-muted-foreground border-t border-white/10">
        <div className="container mx-auto px-4">
          <p className="mb-2">Datos oficiales del Ministerio de Industria y Turismo</p>
          <p className="text-sm mb-2">© 2025 GasolinaSmart. Precios actualizados en tiempo real.</p>
          <p className="text-sm">
            Desarrollado por{" "}
            <a 
              href="https://github.com/computingvictor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              ComputingVictor
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
