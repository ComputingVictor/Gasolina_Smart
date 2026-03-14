import pool from '../db/index.js';

const FUEL_FIELD_MAP = {
  'gasolina95': 'Precio Gasolina 95 E5',
  'gasolina98': 'Precio Gasolina 98 E5',
  'gasoleoa': 'Precio Gasoleo A',
  'gasoleob': 'Precio Gasoleo B',
  'gasoleoplus': 'Precio Gasoleo Premium'
};

const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === '') return null;
  return parseFloat(priceStr.replace(',', '.'));
};

const calculateStats = (prices) => {
  if (prices.length === 0) return { avg: null, min: null, max: null };

  const validPrices = prices.filter(p => p !== null);
  if (validPrices.length === 0) return { avg: null, min: null, max: null };

  const sum = validPrices.reduce((acc, price) => acc + price, 0);
  const avg = sum / validPrices.length;
  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);

  return { avg, min, max };
};

const fetchAndStoreDailyPrices = async () => {
  try {
    console.log('📊 Iniciando obtención de precios diarios...');

    // Fetch data from API
    const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stations = data.ListaEESSPrecio || [];

    console.log(`📍 ${stations.length} gasolineras obtenidas`);

    // Calculate statistics for each fuel type
    const fuelStats = {};

    for (const [fuelKey, fuelField] of Object.entries(FUEL_FIELD_MAP)) {
      const prices = stations
        .map(station => parsePrice(station[fuelField]))
        .filter(price => price !== null && price < 999);

      fuelStats[fuelKey] = calculateStats(prices);
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Insert or update in database
    const query = `
      INSERT INTO fuel_price_history (
        date,
        gasolina95_avg, gasolina95_min, gasolina95_max,
        gasolina98_avg, gasolina98_min, gasolina98_max,
        gasoleoa_avg, gasoleoa_min, gasoleoa_max,
        gasoleob_avg, gasoleob_min, gasoleob_max,
        gasoleoplus_avg, gasoleoplus_min, gasoleoplus_max,
        total_stations
      ) VALUES (
        $1,
        $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16,
        $17
      )
      ON CONFLICT (date)
      DO UPDATE SET
        gasolina95_avg = EXCLUDED.gasolina95_avg,
        gasolina95_min = EXCLUDED.gasolina95_min,
        gasolina95_max = EXCLUDED.gasolina95_max,
        gasolina98_avg = EXCLUDED.gasolina98_avg,
        gasolina98_min = EXCLUDED.gasolina98_min,
        gasolina98_max = EXCLUDED.gasolina98_max,
        gasoleoa_avg = EXCLUDED.gasoleoa_avg,
        gasoleoa_min = EXCLUDED.gasoleoa_min,
        gasoleoa_max = EXCLUDED.gasoleoa_max,
        gasoleob_avg = EXCLUDED.gasoleob_avg,
        gasoleob_min = EXCLUDED.gasoleob_min,
        gasoleob_max = EXCLUDED.gasoleob_max,
        gasoleoplus_avg = EXCLUDED.gasoleoplus_avg,
        gasoleoplus_min = EXCLUDED.gasoleoplus_min,
        gasoleoplus_max = EXCLUDED.gasoleoplus_max,
        total_stations = EXCLUDED.total_stations,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      today,
      fuelStats.gasolina95.avg, fuelStats.gasolina95.min, fuelStats.gasolina95.max,
      fuelStats.gasolina98.avg, fuelStats.gasolina98.min, fuelStats.gasolina98.max,
      fuelStats.gasoleoa.avg, fuelStats.gasoleoa.min, fuelStats.gasoleoa.max,
      fuelStats.gasoleob.avg, fuelStats.gasoleob.min, fuelStats.gasoleob.max,
      fuelStats.gasoleoplus.avg, fuelStats.gasoleoplus.min, fuelStats.gasoleoplus.max,
      stations.length
    ];

    const result = await pool.query(query, values);
    console.log('✅ Precios diarios guardados:', result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Error al obtener y guardar precios:', error);
    throw error;
  }
};

const getPriceHistory = async (days = 30) => {
  try {
    const query = `
      SELECT * FROM fuel_price_history
      ORDER BY date DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [days]);
    return result.rows.reverse(); // Return in ascending order (oldest first)
  } catch (error) {
    console.error('❌ Error al obtener historial de precios:', error);
    throw error;
  }
};

export { fetchAndStoreDailyPrices, getPriceHistory };
