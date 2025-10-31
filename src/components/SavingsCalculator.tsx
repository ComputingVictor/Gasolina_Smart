import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingDown, Car, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Station {
  id: string;
  name: string;
  address: string;
  price: number;
  distance?: number;
}

interface SavingsCalculatorProps {
  currentStation: Station;
  closestStation?: Station;
  allStations: Station[];
}

export const SavingsCalculator = ({
  currentStation,
  closestStation,
  allStations
}: SavingsCalculatorProps) => {
  const [liters, setLiters] = useState<string>("40");
  const [showResults, setShowResults] = useState(false);

  // Configuración: consumo promedio en L/100km (7L es un valor razonable)
  const AVG_CONSUMPTION = 7;

  const calculateSavings = () => {
    const litersNum = parseFloat(liters);
    if (isNaN(litersNum) || litersNum <= 0) return null;

    // Encuentra la gasolinera más barata y la más cercana
    const cheapestStation = allStations.reduce((prev, current) =>
      prev.price < current.price ? prev : current
    );

    const nearestStation = closestStation || allStations.reduce((prev, current) =>
      (prev.distance || 0) < (current.distance || 0) ? prev : current
    );

    // Cálculo del ahorro base
    const costHere = litersNum * currentStation.price;
    const costCheapest = litersNum * cheapestStation.price;
    const costNearest = litersNum * nearestStation.price;

    const savingsVsCheapest = costCheapest - costHere;
    const savingsVsNearest = costNearest - costHere;

    // Cálculo del coste del desplazamiento
    const extraDistanceVsCheapest = Math.abs((currentStation.distance || 0) - (cheapestStation.distance || 0));
    const extraDistanceVsNearest = Math.abs((currentStation.distance || 0) - (nearestStation.distance || 0));

    // Ida y vuelta
    const roundTripCheapest = extraDistanceVsCheapest * 2;
    const roundTripNearest = extraDistanceVsNearest * 2;

    // Litros consumidos en el desplazamiento
    const fuelCostCheapest = (roundTripCheapest / 100) * AVG_CONSUMPTION * currentStation.price;
    const fuelCostNearest = (roundTripNearest / 100) * AVG_CONSUMPTION * currentStation.price;

    // Ahorro neto (considerando el coste del viaje)
    const netSavingsCheapest = savingsVsCheapest - fuelCostCheapest;
    const netSavingsNearest = savingsVsNearest - fuelCostNearest;

    return {
      currentStation,
      cheapestStation,
      nearestStation,
      liters: litersNum,
      costHere,
      costCheapest,
      costNearest,
      grossSavingsCheapest: savingsVsCheapest,
      grossSavingsNearest: savingsVsNearest,
      travelCostCheapest: fuelCostCheapest,
      travelCostNearest: fuelCostNearest,
      netSavingsCheapest,
      netSavingsNearest,
      worthItCheapest: netSavingsCheapest > 1, // Vale la pena si ahorras más de 1€
      worthItNearest: netSavingsNearest > 0.5,
      extraDistanceCheapest: roundTripCheapest,
      extraDistanceNearest: roundTripNearest,
    };
  };

  const results = showResults ? calculateSavings() : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h4 className="text-lg font-semibold">Calculadora de Ahorro</h4>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground mb-2 block">
            ¿Cuántos litros necesitas?
          </label>
          <Input
            type="number"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            placeholder="40"
            min="1"
            max="200"
            className="glass border-white/10"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={() => setShowResults(!showResults)}
            className="bg-primary hover:bg-primary/90"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calcular
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {results && showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Resumen de coste aquí */}
            <Card className="glass border-white/10 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coste aquí ({results.liters}L):</span>
                  <span className="text-xl font-bold">{results.costHere.toFixed(2)}€</span>
                </div>
              </div>
            </Card>

            {/* Comparación con la más barata */}
            {results.cheapestStation.id !== currentStation.id && (
              <Card className={`border-2 p-4 ${
                results.worthItCheapest
                  ? 'bg-green-500/10 border-green-500/50'
                  : 'bg-orange-500/10 border-orange-500/50'
              }`}>
                <div className="flex items-start gap-3">
                  {results.worthItCheapest ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Gasolinera más barata: {results.cheapestStation.name}
                    </h5>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio:</span>
                        <span className="font-medium">{results.cheapestStation.price.toFixed(3)}€/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coste total:</span>
                        <span className="font-medium">{results.costCheapest.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distancia extra:</span>
                        <span className="font-medium">{results.extraDistanceCheapest.toFixed(1)} km (ida y vuelta)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coste del viaje:</span>
                        <span className="font-medium text-orange-400">-{results.travelCostCheapest.toFixed(2)}€</span>
                      </div>

                      <div className="pt-2 border-t border-white/10 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Ahorro neto:</span>
                          <span className={`text-lg font-bold ${
                            results.netSavingsCheapest > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {results.netSavingsCheapest > 0 ? '+' : ''}{results.netSavingsCheapest.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-3 p-3 rounded-lg ${
                      results.worthItCheapest
                        ? 'bg-green-500/20'
                        : 'bg-orange-500/20'
                    }`}>
                      <p className="text-sm font-medium">
                        {results.worthItCheapest ? (
                          <>
                            ✅ <span className="text-green-400">Vale la pena</span> ir a esta gasolinera.
                            Ahorrarás <span className="font-bold">{results.netSavingsCheapest.toFixed(2)}€</span> incluso
                            considerando el combustible extra del desplazamiento.
                          </>
                        ) : (
                          <>
                            ⚠️ <span className="text-orange-400">No vale la pena</span> el desplazamiento.
                            El coste del viaje ({results.travelCostCheapest.toFixed(2)}€) reduce el ahorro
                            a solo {results.netSavingsCheapest.toFixed(2)}€.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Comparación con la más cercana */}
            {results.nearestStation.id !== currentStation.id && (
              <Card className="glass border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <h5 className="font-semibold">
                      Gasolinera más cercana: {results.nearestStation.name}
                    </h5>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio:</span>
                        <span className="font-medium">{results.nearestStation.price.toFixed(3)}€/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coste total:</span>
                        <span className="font-medium">{results.costNearest.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ahorro vs más cercana:</span>
                        <span className={`font-bold ${
                          results.grossSavingsNearest > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {results.grossSavingsNearest > 0 ? '+' : ''}{results.grossSavingsNearest.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Si esta ES la mejor opción */}
            {results.cheapestStation.id === currentStation.id && (
              <Card className="bg-green-500/20 border-2 border-green-500/50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <div>
                    <h5 className="font-bold text-green-400">¡Esta es la gasolinera más barata!</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ahorrarás {results.liters * (results.costNearest / results.liters - currentStation.price).toFixed(2)}€
                      respecto a la más cercana
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
