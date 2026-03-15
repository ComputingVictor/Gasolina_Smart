import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts";

interface ChartDataPoint {
  date: string;
  price?: number | null;
  avg_price?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  station_count?: number;
  station_name?: string;
  city?: string;
  brand?: string;
}

interface FilterState {
  fuelType: string;
  province: string;
  city: string;
  brand: string;
  stationId: string;
  dateRange: string;
}

interface AdvancedChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  filters: FilterState;
}

const fuelNames: { [key: string]: string } = {
  gasolina95: "Gasolina 95",
  gasolina98: "Gasolina 98",
  gasoleoa: "Gasóleo A",
  gasoleob: "Gasóleo B",
};

export const AdvancedChart = ({ data, isLoading, filters }: AdvancedChartProps) => {
  const getLocationLabel = () => {
    if (filters.stationId !== 'all') {
      const firstItem = data[0];
      return firstItem ? `${firstItem.station_name} - ${firstItem.city}` : 'Gasolinera';
    }
    if (filters.city !== 'all') {
      return filters.city;
    }
    if (filters.province !== 'all') {
      return filters.province;
    }
    return 'España';
  };

  const getBrandLabel = () => {
    if (filters.brand !== 'all') {
      return ` - ${filters.brand}`;
    }
    return '';
  };

  const formattedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }));

  const isIndividualStation = filters.stationId !== 'all';

  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur mt-8">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">
          {fuelNames[filters.fuelType] || filters.fuelType}
        </CardTitle>
        <CardDescription className="text-base">
          {isIndividualStation ? 'Precio individual' : 'Precio medio'} en {getLocationLabel()}{getBrandLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] md:h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Cargando datos históricos...</p>
              </div>
            </div>
          ) : formattedData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground text-lg mb-2">No hay datos disponibles</p>
                <p className="text-sm text-muted-foreground">
                  Intenta seleccionar diferentes filtros o espera a que se recopilen más datos
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {isIndividualStation ? (
                <LineChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    label={{ value: '€/litro', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    formatter={(value: number | null) => {
                      if (value === null) return ['N/A', ''];
                      return [`${value.toFixed(3)} €/L`, ''];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Precio"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <ComposedChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    label={{ value: '€/litro', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    formatter={(value: number | null, name: string) => {
                      if (value === null) return ['N/A', name];
                      return [`${value.toFixed(3)} €/L`, name];
                    }}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="max_price"
                    fill="hsl(var(--primary) / 0.1)"
                    stroke="none"
                    name="Máximo"
                  />
                  <Area
                    type="monotone"
                    dataKey="min_price"
                    fill="hsl(var(--background))"
                    stroke="none"
                    name="Mínimo"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Precio medio"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {formattedData.length > 0 && !isIndividualStation && formattedData[0]?.station_count && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            <p>Datos de {formattedData[0].station_count} gasolineras</p>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>Datos oficiales actualizados diariamente</p>
          <p className="text-xs mt-1">Fuente: Ministerio de Industria y Turismo</p>
        </div>
      </CardContent>
    </Card>
  );
};
