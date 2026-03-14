import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface FuelPriceData {
  date: string;
  gasolina95_avg: number | null;
  gasolina98_avg: number | null;
  gasoleoa_avg: number | null;
  gasoleob_avg: number | null;
}

interface ChartDataPoint {
  month: string;
  gasolina95: number | null;
  gasolina98: number | null;
  gasoleoA: number | null;
  gasoleoB: number | null;
}

type TimeRange = "6m" | "1y" | "2y" | "3y";

interface FuelColors {
  [key: string]: string;
}

const fuelColors: FuelColors = {
  gasolina95: "#10b981", // verde
  gasolina98: "#3b82f6", // azul
  gasoleoA: "#f59e0b", // naranja
  gasoleoB: "#ef4444", // rojo
};

const fuelNames: { [key: string]: string } = {
  gasolina95: "Gasolina 95",
  gasolina98: "Gasolina 98",
  gasoleoA: "Gasóleo A",
  gasoleoB: "Gasóleo B",
};

export const FuelPriceHistoryChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y");
  const [selectedFuels, setSelectedFuels] = useState<string[]>(["gasolina95", "gasoleoA"]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setIsLoading(true);
        const ranges: { [key in TimeRange]: number } = {
          "6m": 180,
          "1y": 365,
          "2y": 730,
          "3y": 1095,
        };

        const days = ranges[timeRange];
        const response = await fetch(`/api/fuel-prices/history?days=${days}`);

        if (!response.ok) {
          throw new Error('Error al cargar historial de precios');
        }

        const data: FuelPriceData[] = await response.json();

        const formattedData: ChartDataPoint[] = data.map((item) => {
          const date = new Date(item.date);
          const monthYear = date.toLocaleDateString('es-ES', {
            month: 'short',
            year: 'numeric'
          });

          return {
            month: monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
            gasolina95: item.gasolina95_avg,
            gasolina98: item.gasolina98_avg,
            gasoleoA: item.gasoleoa_avg,
            gasoleoB: item.gasoleob_avg,
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching price history:', error);
        toast.error('Error al cargar el historial de precios');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [timeRange]);

  const filteredData = chartData;

  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev =>
      prev.includes(fuel)
        ? prev.filter(f => f !== fuel)
        : [...prev, fuel]
    );
  };

  return (
    <div className="w-full py-12 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              Evolución Histórica de Precios
            </CardTitle>
            <CardDescription className="text-base">
              Precio medio del combustible en España (€/litro)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Período de tiempo</label>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecciona período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6m">Últimos 6 meses</SelectItem>
                    <SelectItem value="1y">Último año</SelectItem>
                    <SelectItem value="2y">Últimos 2 años</SelectItem>
                    <SelectItem value="3y">Últimos 3 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Tipos de combustible</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(fuelNames).map(([key, name]) => (
                    <button
                      key={key}
                      onClick={() => toggleFuel(key)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedFuels.includes(key)
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      style={selectedFuels.includes(key) ? {
                        backgroundColor: fuelColors[key],
                        color: 'white'
                      } : undefined}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-[400px] md:h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Cargando datos históricos...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No hay datos disponibles</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
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

                  {selectedFuels.includes("gasolina95") && (
                    <Line
                      type="monotone"
                      dataKey="gasolina95"
                      stroke={fuelColors.gasolina95}
                      strokeWidth={2}
                      name="Gasolina 95"
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {selectedFuels.includes("gasolina98") && (
                    <Line
                      type="monotone"
                      dataKey="gasolina98"
                      stroke={fuelColors.gasolina98}
                      strokeWidth={2}
                      name="Gasolina 98"
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {selectedFuels.includes("gasoleoA") && (
                    <Line
                      type="monotone"
                      dataKey="gasoleoA"
                      stroke={fuelColors.gasoleoA}
                      strokeWidth={2}
                      name="Gasóleo A"
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {selectedFuels.includes("gasoleoB") && (
                    <Line
                      type="monotone"
                      dataKey="gasoleoB"
                      stroke={fuelColors.gasoleoB}
                      strokeWidth={2}
                      name="Gasóleo B"
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-6 text-sm text-muted-foreground text-center">
              <p>Datos oficiales actualizados diariamente</p>
              <p className="text-xs mt-1">Fuente: Ministerio de Industria y Turismo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
