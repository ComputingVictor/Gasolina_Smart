-- Tabla para almacenar el historial diario de precios de combustible
CREATE TABLE IF NOT EXISTS fuel_price_history (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  gasolina95_avg DECIMAL(6,3),
  gasolina98_avg DECIMAL(6,3),
  gasoleoa_avg DECIMAL(6,3),
  gasoleob_avg DECIMAL(6,3),
  gasoleoplus_avg DECIMAL(6,3),
  gasolina95_min DECIMAL(6,3),
  gasolina98_min DECIMAL(6,3),
  gasoleoa_min DECIMAL(6,3),
  gasoleob_min DECIMAL(6,3),
  gasoleoplus_min DECIMAL(6,3),
  gasolina95_max DECIMAL(6,3),
  gasolina98_max DECIMAL(6,3),
  gasoleoa_max DECIMAL(6,3),
  gasoleob_max DECIMAL(6,3),
  gasoleoplus_max DECIMAL(6,3),
  total_stations INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por fecha
CREATE INDEX IF NOT EXISTS idx_fuel_price_history_date ON fuel_price_history(date DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_fuel_price_history_updated_at ON fuel_price_history;
CREATE TRIGGER update_fuel_price_history_updated_at
    BEFORE UPDATE ON fuel_price_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla para historial de precios por gasolinera individual
CREATE TABLE IF NOT EXISTS fuel_price_history_by_station (
  id BIGSERIAL PRIMARY KEY,
  station_id VARCHAR(20) NOT NULL,
  date DATE NOT NULL,

  -- Información de la gasolinera (desnormalizada para eficiencia)
  station_name VARCHAR(200),
  province VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  brand VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  schedule TEXT,

  -- Precios de combustibles (nullable - no todas las gasolineras venden todos los tipos)
  gasolina95_price DECIMAL(6,3),
  gasolina98_price DECIMAL(6,3),
  gasoleoa_price DECIMAL(6,3),
  gasoleob_price DECIMAL(6,3),
  gasoleoplus_price DECIMAL(6,3),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Restricción única: una gasolinera solo puede tener un registro por día
  UNIQUE(station_id, date)
);

-- Índices para optimizar consultas filtradas
CREATE INDEX IF NOT EXISTS idx_station_history_date ON fuel_price_history_by_station(date DESC);
CREATE INDEX IF NOT EXISTS idx_station_history_station_id ON fuel_price_history_by_station(station_id);
CREATE INDEX IF NOT EXISTS idx_station_history_city ON fuel_price_history_by_station(city);
CREATE INDEX IF NOT EXISTS idx_station_history_province ON fuel_price_history_by_station(province);
CREATE INDEX IF NOT EXISTS idx_station_history_brand ON fuel_price_history_by_station(brand);

-- Índice compuesto para el patrón de consulta más común
CREATE INDEX IF NOT EXISTS idx_station_history_query_pattern
  ON fuel_price_history_by_station(date DESC, city, brand);
