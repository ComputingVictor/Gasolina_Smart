import { motion } from "framer-motion";
import { MapPin, TrendingDown, Zap, TrendingUp, Gift, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewHistory: () => void;
  onViewPromotions: () => void;
  onViewAdvancedAnalysis: () => void;
}

export const HeroSection = ({ onGetStarted, onViewHistory, onViewPromotions, onViewAdvancedAnalysis }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Precios en tiempo real</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Encuentra la
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
              gasolina más barata
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Compara precios en tiempo real de miles de gasolineras en España. 
            Ahorra en cada repostaje con nuestra tecnología inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_40px_hsl(263_70%_60%_/_0.6)] hover:shadow-[0_0_60px_hsl(263_70%_60%_/_0.8)] transition-all duration-300"
              onClick={onGetStarted}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Buscar cerca de mí
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full glass border-white/20 hover:bg-white/10"
              onClick={onViewAdvancedAnalysis}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Análisis Avanzado
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full glass border-white/20 hover:bg-white/10"
              onClick={onViewPromotions}
            >
              <Gift className="w-5 h-5 mr-2" />
              Ver promociones
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full glass border-white/20 hover:bg-white/10"
              onClick={onViewHistory}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Histórico
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto"
        >
          {[
            { icon: MapPin, value: "+12.000", label: "Gasolineras" },
            { icon: TrendingDown, value: "15%", label: "Ahorro medio" },
            { icon: Zap, value: "Tiempo real", label: "Actualizaciones" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};