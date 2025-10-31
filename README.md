# GasolinaSmart

Aplicación web para encontrar las gasolineras más baratas cerca de ti en España. Compara precios de combustible en tiempo real utilizando datos oficiales del Ministerio de Industria y Turismo.

## Descripción del Proyecto

GasolinaSmart es una herramienta que permite a los usuarios localizar las estaciones de servicio más económicas en su área, ayudándoles a ahorrar dinero en cada repostaje. La aplicación ofrece:

- **Búsqueda por ubicación**: Usa tu geolocalización o busca por dirección
- **Comparación de precios en tiempo real**: Datos actualizados del gobierno español
- **Múltiples tipos de combustible**: Gasolina 95, 98, Gasóleo A, B y Premium
- **Filtros avanzados**: Por marca, horario, radio de búsqueda y más
- **Visualización en mapa**: Mapa interactivo con todas las estaciones cercanas
- **Navegación integrada**: Abre la ruta directamente en Google Maps

## Objetivo

El objetivo de GasolinaSmart es democratizar el acceso a información de precios de combustible, permitiendo a cualquier persona en España encontrar fácilmente las opciones más económicas cerca de su ubicación. En un contexto donde el precio del combustible puede variar significativamente entre estaciones, esta herramienta ayuda a los usuarios a tomar decisiones informadas y ahorrar en sus gastos de transporte.

## Características Principales

- Interfaz moderna y responsive
- Búsqueda por geolocalización automática
- Búsqueda manual por dirección o ciudad
- Filtrado por tipo de combustible
- Radio de búsqueda personalizable (5-50 km)
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
- **Mapas**: Leaflet + React-Leaflet
- **Routing**: React Router DOM
- **Gestión de Estado**: React Query
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: Sonner
- **Animaciones**: Framer Motion


## Fuente de Datos

Los datos de precios de combustible se obtienen en tiempo real de la API oficial del Ministerio de Industria y Turismo de España:
- API: `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/`

## Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── ui/           # Componentes de interfaz reutilizables
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── SearchSection.tsx
│   ├── FilterControls.tsx
│   ├── MapComponent.tsx
│   ├── StationsList.tsx
│   └── StationCard.tsx
├── pages/            # Páginas de la aplicación
├── hooks/            # Custom React hooks
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