# GasolinaSmart

[![Deploy to GitHub Pages](https://github.com/ComputingVictor/Gasolina_Smart/actions/workflows/deploy.yml/badge.svg)](https://github.com/ComputingVictor/Gasolina_Smart/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)

🚀 **[Ver Aplicación en Vivo](https://computingvictor.github.io/Gasolina_Smart/)** 🚀

Aplicación web para encontrar las gasolineras más baratas cerca de ti en España. Compara precios de combustible en tiempo real utilizando datos oficiales del Ministerio de Industria y Turismo.

## 📸 Demo

Visita la aplicación en vivo: **[https://computingvictor.github.io/Gasolina_Smart/](https://computingvictor.github.io/Gasolina_Smart/)**

## Descripción del Proyecto

GasolinaSmart es una herramienta que permite a los usuarios localizar las estaciones de servicio más económicas en su área, ayudándoles a ahorrar dinero en cada repostaje. La aplicación ofrece:

- **Búsqueda por ubicación**: Usa tu geolocalización o busca por dirección
- **Comparación de precios en tiempo real**: Datos actualizados del gobierno español
- **Múltiples tipos de combustible**: Gasolina 95, 98, Gasóleo A, B y Premium
- **Filtros avanzados**: Por marca, horario, radio de búsqueda y más
- **Visualización en mapa**: Mapa interactivo con todas las estaciones cercanas
- **Navegación integrada**: Abre la ruta directamente en Google Maps
- **Gráfico histórico de precios**: Visualiza la evolución de precios desde 2023 hasta la actualidad
- **Sección de promociones**: Encuentra ofertas y descuentos en gasolineras

## Objetivo

El objetivo de GasolinaSmart es democratizar el acceso a información de precios de combustible, permitiendo a cualquier persona en España encontrar fácilmente las opciones más económicas cerca de su ubicación. En un contexto donde el precio del combustible puede variar significativamente entre estaciones, esta herramienta ayuda a los usuarios a tomar decisiones informadas y ahorrar en sus gastos de transporte.

## Características Principales

- Interfaz moderna y responsive
- Búsqueda por geolocalización automática
- Búsqueda manual por dirección o ciudad
- Filtrado por tipo de combustible
- Radio de búsqueda personalizable (2.5-30 km)
- **Calculadora de ahorro inteligente**: Calcula si vale la pena ir a una gasolinera más lejana considerando el coste del desplazamiento
- **Análisis histórico de precios**: Gráficos interactivos con evolución de precios desde 2023 hasta diciembre 2025
- **Sistema de promociones**: Visualización de ofertas especiales y descuentos
- Filtrado automático de estaciones de autobuses
- Filtros por marca de estación
- Filtro para gasolineras 24 horas
- Ordenación por precio, distancia o nombre
- Mapa interactivo con marcadores
- Lista detallada con información de cada estación
- Navegación directa a Google Maps
- Datos oficiales del Ministerio

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui + Radix UI
- **Mapas**: Leaflet 1.9.4 + React-Leaflet
- **Routing**: React Router DOM 6.30.1
- **Gestión de Estado**: TanStack Query 5.83.0
- **Formularios**: React Hook Form 7.61.1 + Zod 3.25.76
- **Gráficos**: Recharts 2.15.4
- **Notificaciones**: Sonner 1.7.4
- **Animaciones**: Framer Motion 11.18.2
- **Iconos**: Lucide React 0.462.0


## Fuente de Datos

Los datos de precios de combustible se obtienen en tiempo real de la API oficial del Ministerio de Industria y Turismo de España:
- API: `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/`

## Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── ui/           # Componentes de interfaz reutilizables (shadcn/ui)
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── SearchSection.tsx
│   ├── FilterControls.tsx
│   ├── MapComponent.tsx
│   ├── StationsList.tsx
│   ├── StationCard.tsx
│   ├── FuelPriceHistoryChart.tsx  # Gráfico histórico de precios
│   ├── PromotionsSection.tsx      # Sección de promociones
│   ├── SavingsCalculator.tsx      # Calculadora de ahorro
│   └── ErrorBoundary.tsx          # Manejo de errores
├── pages/            # Páginas de la aplicación
│   ├── App.tsx       # Página principal
│   ├── Landing.tsx   # Página de inicio
│   ├── Promotions.tsx # Página de promociones
│   └── NotFound.tsx   # Página 404
├── hooks/            # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/              # Utilidades y configuración
│   ├── utils.ts
│   ├── brandLogos.ts
│   └── fetch-with-retry.ts
└── main.tsx          # Punto de entrada
```

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una sugerencia:

1. Abre un issue describiendo el problema o mejora
2. Haz fork del repositorio
3. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
4. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

Desarrollado por [ComputingVictor](https://github.com/computingvictor)

## Agradecimientos

- Ministerio de Industria y Turismo de España por proporcionar los datos públicos
- OpenStreetMap por el servicio de geocodificación