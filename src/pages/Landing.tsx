import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      
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
