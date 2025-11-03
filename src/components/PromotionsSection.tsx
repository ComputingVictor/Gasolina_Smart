import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, CreditCard, Gift, TrendingDown, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Promotion {
  brand: string;
  brandLogo?: string;
  color: string;
  mainDiscount: string;
  description: string;
  highlights: string[];
  cardType: string;
  icon: React.ReactNode;
  category: "premium" | "supermarket" | "standard";
}

const promotions: Promotion[] = [
  {
    brand: "Repsol Waylet",
    color: "from-red-500 to-orange-500",
    mainDiscount: "Hasta 40 cént./L",
    description: "La app más completa con múltiples formas de ahorro",
    highlights: [
      "10-40 cént./L según energías contratadas",
      "Duplica tu saldo hasta noviembre 2025",
      "10% de cashback en cada repostaje",
      "100% bonificación en recarga eléctrica",
      "Descuentos en Burger King, El Corte Inglés"
    ],
    cardType: "App gratuita + Tarjeta energía",
    icon: <Zap className="w-5 h-5" />,
    category: "premium"
  },
  {
    brand: "Moeve (Cepsa)",
    color: "from-blue-500 to-cyan-500",
    mainDiscount: "Hasta 18.5 cént./L",
    description: "Programa de fidelización renovado con múltiples opciones",
    highlights: [
      "Moeve Pro Direct: hasta 17.50 cént./L",
      "7 cént./L desde el primer litro",
      "5 cént./L adicionales a fin de mes",
      "10€ de bienvenida nuevos usuarios",
      "Más de €300 anuales en ahorro potencial"
    ],
    cardType: "Tarjeta gratuita + App GOW",
    icon: <Star className="w-5 h-5" />,
    category: "premium"
  },
  {
    brand: "Carrefour",
    color: "from-blue-600 to-blue-800",
    mainDiscount: "8-10% cashback",
    description: "Alto porcentaje de devolución en gasolineras propias",
    highlights: [
      "8% de cashback trimestral",
      "10% último fin de semana del mes",
      "4% en gasolineras Cepsa",
      "Sin cambiar de banco",
      "145 estaciones de servicio"
    ],
    cardType: "Tarjeta Pass Carrefour",
    icon: <Percent className="w-5 h-5" />,
    category: "supermarket"
  },
  {
    brand: "BP",
    color: "from-green-500 to-emerald-600",
    mainDiscount: "3 cént./L + bonus",
    description: "Descuento directo con bonificación extra por volumen",
    highlights: [
      "3 cént./L en cada repostaje",
      "2€ extra con +40L en BP Ultimate",
      "Hasta 24€ al mes de ahorro",
      "Sistema de puntos canjeables",
      "Uso en tiendas BP"
    ],
    cardType: "Tarjeta BP",
    icon: <Gift className="w-5 h-5" />,
    category: "standard"
  },
  {
    brand: "Alcampo",
    color: "from-red-600 to-pink-600",
    mainDiscount: "Hasta 8 cént./L",
    description: "Descuentos inmediatos en red de 53 gasolineras",
    highlights: [
      "Hasta 8 cént./L con Alcampo Dúa",
      "Tarjeta Oney gratuita",
      "53 gasolineras en España",
      "Acumulación en compras supermercado",
      "Precios competitivos Low Cost"
    ],
    cardType: "Tarjeta Alcampo Dúa",
    icon: <TrendingDown className="w-5 h-5" />,
    category: "supermarket"
  },
  {
    brand: "Galp + ING/ABANCA",
    color: "from-orange-500 to-yellow-500",
    mainDiscount: "3-5% descuento",
    description: "Descuentos mediante tarjetas bancarias asociadas",
    highlights: [
      "ABANCA Visa: 4-5% descuento",
      "ING: 3% en Galp y Shell",
      "Lidl Plus: hasta 5% (máx 4€)",
      "Programa Mundo Galp puntos",
      "Descuento RACE para socios"
    ],
    cardType: "Tarjeta bancaria asociada",
    icon: <CreditCard className="w-5 h-5" />,
    category: "standard"
  },
  {
    brand: "Eroski + Repsol",
    color: "from-green-600 to-teal-600",
    mainDiscount: "4% cashback",
    description: "Alianza estratégica con devolución mensual",
    highlights: [
      "4% en Repsol, Campsa, Petronor",
      "Tarjeta Eroski Club (4,99€/mes)",
      "Devolución a principios de mes",
      "Límite: 150L/día, 1.500L/mes",
      "Canjeable en supermercados"
    ],
    cardType: "Eroski Club + Repsol Más",
    icon: <Percent className="w-5 h-5" />,
    category: "supermarket"
  },
];

const categoryTitles = {
  premium: "Programas Premium",
  supermarket: "Supermercados",
  standard: "Gasolineras Tradicionales"
};

export const PromotionsSection = () => {
  const groupedPromotions = {
    premium: promotions.filter(p => p.category === "premium"),
    supermarket: promotions.filter(p => p.category === "supermarket"),
    standard: promotions.filter(p => p.category === "standard")
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4" variant="outline">
            <Gift className="w-4 h-4 mr-2" />
            Promociones y Descuentos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ahorra más con{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              tarjetas y apps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre todas las promociones activas de las principales gasolineras.
            Combina descuentos y encuentra el mejor precio posible.
          </p>
        </motion.div>

        {Object.entries(groupedPromotions).map(([category, promos], categoryIndex) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo, index) => (
                <motion.div
                  key={promo.brand}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-card/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`bg-gradient-to-r ${promo.color} p-3 rounded-lg`}>
                          {promo.icon}
                        </div>
                        <Badge variant="secondary" className="text-lg font-bold">
                          {promo.mainDiscount}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{promo.brand}</CardTitle>
                      <CardDescription className="text-sm">
                        {promo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {promo.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${promo.color} flex-shrink-0`} />
                            <span className="text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">{promo.cardType}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Información actualizada a noviembre 2025. Consulta condiciones específicas en cada programa.</p>
        </div>
      </div>
    </section>
  );
};
