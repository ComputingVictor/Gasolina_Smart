import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FuelPriceHistoryChart } from "@/components/FuelPriceHistoryChart";

const Landing = () => {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleViewHistory = () => {
    chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewPromotions = () => {
    navigate('/promociones');
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        onGetStarted={handleGetStarted}
        onViewHistory={handleViewHistory}
        onViewPromotions={handleViewPromotions}
      />
      <FeaturesSection />
      <div ref={chartRef}>
        <FuelPriceHistoryChart />
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

export default Landing;
