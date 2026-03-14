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
