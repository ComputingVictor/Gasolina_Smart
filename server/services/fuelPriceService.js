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

const storeStationHistoricalData = async (stations) => {
  const today = new Date().toISOString().split('T')[0];
  const BATCH_SIZE = 500; // Insertar en lotes de 500 para evitar límites de PostgreSQL
  let totalInserted = 0;

  console.log(`📝 Iniciando inserción de ${stations.length} estaciones en lotes de ${BATCH_SIZE}`);

  // Dividir en lotes
  for (let i = 0; i < stations.length; i += BATCH_SIZE) {
    const batch = stations.slice(i, i + BATCH_SIZE);
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    for (const station of batch) {
      const brand = (station.Rótulo || '').trim();
      const province = station.Provincia || '';
      const city = station.Municipio || station.Localidad || '';
      const address = station.Dirección || '';
      const lat = station.Latitud ? parseFloat(station.Latitud.replace(',', '.')) : null;
      const lng = station['Longitud (WGS84)'] ? parseFloat(station['Longitud (WGS84)'].replace(',', '.')) : null;
      const schedule = station.Horario || '';

      const gasolina95 = parsePrice(station['Precio Gasolina 95 E5']);
      const gasolina98 = parsePrice(station['Precio Gasolina 98 E5']);
      const gasoleoa = parsePrice(station['Precio Gasoleo A']);
      const gasoleob = parsePrice(station['Precio Gasoleo B']);
      const gasoleoplus = parsePrice(station['Precio Gasoleo Premium']);

      // Solo guardar si tiene al menos un precio válido
      if (!gasolina95 && !gasolina98 && !gasoleoa && !gasoleob && !gasoleoplus) {
        continue;
      }

      placeholders.push(
        `($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, ` +
        `$${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6}, $${paramIndex+7}, ` +
        `$${paramIndex+8}, $${paramIndex+9}, $${paramIndex+10}, $${paramIndex+11}, ` +
        `$${paramIndex+12}, $${paramIndex+13}, $${paramIndex+14})`
      );

      values.push(
        station.IDEESS, today, station.Rótulo || 'Sin nombre',
        province, city, address, brand, lat, lng, schedule,
        gasolina95, gasolina98, gasoleoa, gasoleob, gasoleoplus
      );

      paramIndex += 15;
    }

    if (values.length === 0) {
      continue;
    }

    const query = `
      INSERT INTO fuel_price_history_by_station (
        station_id, date, station_name, province, city, address, brand,
        latitude, longitude, schedule,
        gasolina95_price, gasolina98_price, gasoleoa_price,
        gasoleob_price, gasoleoplus_price
      )
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (station_id, date)
      DO UPDATE SET
        station_name = EXCLUDED.station_name,
        gasolina95_price = EXCLUDED.gasolina95_price,
        gasolina98_price = EXCLUDED.gasolina98_price,
        gasoleoa_price = EXCLUDED.gasoleoa_price,
        gasoleob_price = EXCLUDED.gasoleob_price,
        gasoleoplus_price = EXCLUDED.gasoleoplus_price
    `;

    try {
      await pool.query(query, values);
      const batchCount = values.length / 15;
      totalInserted += batchCount;
      console.log(`✅ Lote ${Math.floor(i / BATCH_SIZE) + 1}: ${batchCount} estaciones guardadas (Total: ${totalInserted})`);
    } catch (error) {
      console.error(`❌ Error al insertar lote ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
      console.error('Primer registro del lote:', {
        station_id: values[0],
        date: values[1],
        station_name: values[2],
        province: values[3],
        city: values[4]
      });
      throw error;
    }
  }

  console.log(`✅ Total de estaciones guardadas: ${totalInserted}`);
  return totalInserted;
};

const fetchAndStoreDailyPrices = async () => {
  try {
    console.log('📊 Iniciando obtención de precios diarios...');

    // Fetch data from API
    const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
    console.log('🌐 Llamando a API del gobierno...');
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stations = data.ListaEESSPrecio || [];

    console.log(`📍 ${stations.length} gasolineras obtenidas`);

    if (stations.length === 0) {
      console.warn('⚠️  La API no devolvió ninguna gasolinera');
      return null;
    }

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

    // Guardar datos individuales de cada gasolinera
    await storeStationHistoricalData(stations);

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

const getStationHistoryFiltered = async (filters) => {
  const {
    fuelType = 'gasolina95',
    province,
    city,
    brand,
    stationId,
    days = 365
  } = filters;

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (province && province !== 'all') {
    conditions.push(`province = $${paramIndex++}`);
    params.push(province);
  }

  if (city && city !== 'all') {
    conditions.push(`city = $${paramIndex++}`);
    params.push(city);
  }

  if (brand && brand !== 'all') {
    conditions.push(`LOWER(brand) LIKE $${paramIndex++}`);
    params.push(`%${brand.toLowerCase()}%`);
  }

  if (stationId && stationId !== 'all') {
    conditions.push(`station_id = $${paramIndex++}`);
    params.push(stationId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const fuelColumn = `${fuelType}_price`;

  // Si es gasolinera específica, devolver datos individuales
  if (stationId && stationId !== 'all') {
    const query = `
      SELECT
        date,
        station_name,
        city,
        brand,
        ${fuelColumn} as price
      FROM fuel_price_history_by_station
      ${whereClause}
      ORDER BY date DESC
      LIMIT $${paramIndex}
    `;
    params.push(days);

    const result = await pool.query(query, params);
    return result.rows.reverse();
  }

  // De lo contrario, agregar por fecha
  const query = `
    SELECT
      date,
      AVG(${fuelColumn}) as avg_price,
      MIN(${fuelColumn}) as min_price,
      MAX(${fuelColumn}) as max_price,
      COUNT(*) as station_count
    FROM fuel_price_history_by_station
    ${whereClause}
    GROUP BY date
    ORDER BY date DESC
    LIMIT $${paramIndex}
  `;
  params.push(days);

  const result = await pool.query(query, params);
  return result.rows.reverse();
};

const getFilterOptions = async () => {
  const provinceQuery = `
    SELECT DISTINCT province
    FROM fuel_price_history_by_station
    WHERE province IS NOT NULL AND province != ''
    ORDER BY province
  `;

  const brandQuery = `
    SELECT DISTINCT brand
    FROM fuel_price_history_by_station
    WHERE brand IS NOT NULL AND brand != ''
    ORDER BY brand
  `;

  const [provinces, brands] = await Promise.all([
    pool.query(provinceQuery),
    pool.query(brandQuery)
  ]);

  return {
    provinces: provinces.rows.map(r => r.province),
    brands: brands.rows.map(r => r.brand)
  };
};

const getCitiesByProvince = async (province) => {
  const query = `
    SELECT DISTINCT city
    FROM fuel_price_history_by_station
    WHERE province = $1 AND city IS NOT NULL AND city != ''
    ORDER BY city
  `;

  const result = await pool.query(query, [province]);
  return result.rows.map(r => r.city);
};

const getStationsByCity = async (city, brand = null) => {
  let query = `
    SELECT DISTINCT
      station_id,
      station_name,
      brand,
      address
    FROM fuel_price_history_by_station
    WHERE city = $1
  `;

  const params = [city];

  if (brand && brand !== 'all') {
    query += ` AND LOWER(brand) LIKE $2`;
    params.push(`%${brand.toLowerCase()}%`);
  }

  query += ` ORDER BY station_name LIMIT 500`;

  const result = await pool.query(query, params);
  return result.rows;
};

export {
  fetchAndStoreDailyPrices,
  getPriceHistory,
  getStationHistoryFiltered,
  getFilterOptions,
  getCitiesByProvince,
  getStationsByCity
};
