import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PromotionsSection } from "@/components/PromotionsSection";

const Promotions = () => {
  const navigate = useNavigate();

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
        <PromotionsSection />
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

export default Promotions;
