import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

import pool from './db/index.js';
import {
  fetchAndStoreDailyPrices,
  getPriceHistory,
  getStationHistoryFiltered,
  getFilterOptions,
  getCitiesByProvince,
  getStationsByCity
} from './services/fuelPriceService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Seed historical data
const seedHistoricalData = async () => {
  const historicalData = [
    // 2023
    { date: "2023-01-15", gasolina95: 1.591, gasolina98: 1.767, gasoleoA: 1.647, gasoleoB: 1.577 },
    { date: "2023-02-15", gasolina95: 1.600, gasolina98: 1.773, gasoleoA: 1.584, gasoleoB: 1.514 },
    { date: "2023-03-15", gasolina95: 1.597, gasolina98: 1.770, gasoleoA: 1.534, gasoleoB: 1.464 },
    { date: "2023-04-15", gasolina95: 1.602, gasolina98: 1.772, gasoleoA: 1.472, gasoleoB: 1.402 },
    { date: "2023-05-15", gasolina95: 1.549, gasolina98: 1.720, gasoleoA: 1.393, gasoleoB: 1.323 },
    { date: "2023-06-15", gasolina95: 1.556, gasolina98: 1.728, gasoleoA: 1.405, gasoleoB: 1.335 },
    { date: "2023-07-15", gasolina95: 1.575, gasolina98: 1.747, gasoleoA: 1.437, gasoleoB: 1.367 },
    { date: "2023-08-15", gasolina95: 1.661, gasolina98: 1.835, gasoleoA: 1.562, gasoleoB: 1.492 },
    { date: "2023-09-15", gasolina95: 1.703, gasolina98: 1.875, gasoleoA: 1.629, gasoleoB: 1.559 },
    { date: "2023-10-15", gasolina95: 1.636, gasolina98: 1.805, gasoleoA: 1.626, gasoleoB: 1.556 },
    { date: "2023-11-15", gasolina95: 1.568, gasolina98: 1.741, gasoleoA: 1.555, gasoleoB: 1.485 },
    { date: "2023-12-15", gasolina95: 1.510, gasolina98: 1.685, gasoleoA: 1.482, gasoleoB: 1.412 },
    // 2024
    { date: "2024-01-15", gasolina95: 1.506, gasolina98: 1.685, gasoleoA: 1.466, gasoleoB: 1.396 },
    { date: "2024-02-15", gasolina95: 1.555, gasolina98: 1.733, gasoleoA: 1.518, gasoleoB: 1.448 },
    { date: "2024-03-15", gasolina95: 1.592, gasolina98: 1.771, gasoleoA: 1.513, gasoleoB: 1.443 },
    { date: "2024-04-15", gasolina95: 1.643, gasolina98: 1.823, gasoleoA: 1.526, gasoleoB: 1.456 },
    { date: "2024-05-15", gasolina95: 1.626, gasolina98: 1.804, gasoleoA: 1.476, gasoleoB: 1.406 },
    { date: "2024-06-15", gasolina95: 1.584, gasolina98: 1.765, gasoleoA: 1.447, gasoleoB: 1.377 },
    { date: "2024-07-15", gasolina95: 1.581, gasolina98: 1.761, gasoleoA: 1.471, gasoleoB: 1.401 },
    { date: "2024-08-15", gasolina95: 1.541, gasolina98: 1.726, gasoleoA: 1.428, gasoleoB: 1.358 },
    { date: "2024-09-15", gasolina95: 1.473, gasolina98: 1.657, gasoleoA: 1.368, gasoleoB: 1.298 },
    { date: "2024-10-15", gasolina95: 1.468, gasolina98: 1.652, gasoleoA: 1.369, gasoleoB: 1.299 },
    { date: "2024-11-15", gasolina95: 1.475, gasolina98: 1.656, gasoleoA: 1.391, gasoleoB: 1.321 },
    { date: "2024-12-15", gasolina95: 1.487, gasolina98: 1.666, gasoleoA: 1.413, gasoleoB: 1.343 },
    // 2025
    { date: "2025-01-15", gasolina95: 1.529, gasolina98: 1.709, gasoleoA: 1.460, gasoleoB: 1.390 },
    { date: "2025-02-15", gasolina95: 1.541, gasolina98: 1.717, gasoleoA: 1.477, gasoleoB: 1.407 },
    { date: "2025-03-01", gasolina95: 1.498, gasolina98: 1.678, gasoleoA: 1.438, gasoleoB: 1.368 },
  ];

  console.log('📊 Poblando datos históricos iniciales...');
  const variance = 0.03;

  for (const record of historicalData) {
    try {
      const query = `
        INSERT INTO fuel_price_history (
          date,
          gasolina95_avg, gasolina95_min, gasolina95_max,
          gasolina98_avg, gasolina98_min, gasolina98_max,
          gasoleoa_avg, gasoleoa_min, gasoleoa_max,
          gasoleob_avg, gasoleob_min, gasoleob_max,
          total_stations
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )
        ON CONFLICT (date) DO NOTHING;
      `;

      await pool.query(query, [
        record.date,
        record.gasolina95,
        Number((record.gasolina95 * (1 - variance)).toFixed(3)),
        Number((record.gasolina95 * (1 + variance)).toFixed(3)),
        record.gasolina98,
        Number((record.gasolina98 * (1 - variance)).toFixed(3)),
        Number((record.gasolina98 * (1 + variance)).toFixed(3)),
        record.gasoleoA,
        Number((record.gasoleoA * (1 - variance)).toFixed(3)),
        Number((record.gasoleoA * (1 + variance)).toFixed(3)),
        record.gasoleoB,
        Number((record.gasoleoB * (1 - variance)).toFixed(3)),
        Number((record.gasoleoB * (1 + variance)).toFixed(3)),
        11500
      ]);
    } catch (error) {
      console.error(`Error insertando ${record.date}:`, error.message);
    }
  }

  console.log('✅ Datos históricos poblados');
};

// Initialize database schema
const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✅ Esquema de base de datos inicializado');

    // Poblar datos históricos
    await seedHistoricalData();

    // Obtener datos del día actual desde la API
    console.log('📊 Obteniendo precios actuales del día de hoy...');
    await fetchAndStoreDailyPrices();
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
  }
};

// API Routes
app.get('/api/fuel-prices/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const history = await getPriceHistory(days);

    // Convert DECIMAL values from strings to numbers
    const formattedHistory = history.map(record => ({
      ...record,
      gasolina95_avg: record.gasolina95_avg ? parseFloat(record.gasolina95_avg) : null,
      gasolina95_min: record.gasolina95_min ? parseFloat(record.gasolina95_min) : null,
      gasolina95_max: record.gasolina95_max ? parseFloat(record.gasolina95_max) : null,
      gasolina98_avg: record.gasolina98_avg ? parseFloat(record.gasolina98_avg) : null,
      gasolina98_min: record.gasolina98_min ? parseFloat(record.gasolina98_min) : null,
      gasolina98_max: record.gasolina98_max ? parseFloat(record.gasolina98_max) : null,
      gasoleoa_avg: record.gasoleoa_avg ? parseFloat(record.gasoleoa_avg) : null,
      gasoleoa_min: record.gasoleoa_min ? parseFloat(record.gasoleoa_min) : null,
      gasoleoa_max: record.gasoleoa_max ? parseFloat(record.gasoleoa_max) : null,
      gasoleob_avg: record.gasoleob_avg ? parseFloat(record.gasoleob_avg) : null,
      gasoleob_min: record.gasoleob_min ? parseFloat(record.gasoleob_min) : null,
      gasoleob_max: record.gasoleob_max ? parseFloat(record.gasoleob_max) : null,
      gasoleoplus_avg: record.gasoleoplus_avg ? parseFloat(record.gasoleoplus_avg) : null,
      gasoleoplus_min: record.gasoleoplus_min ? parseFloat(record.gasoleoplus_min) : null,
      gasoleoplus_max: record.gasoleoplus_max ? parseFloat(record.gasoleoplus_max) : null,
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Error en /api/fuel-prices/history:', error);
    res.status(500).json({ error: 'Error al obtener historial de precios' });
  }
});

app.post('/api/fuel-prices/update', async (req, res) => {
  try {
    const result = await fetchAndStoreDailyPrices();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error en /api/fuel-prices/update:', error);
    res.status(500).json({ error: 'Error al actualizar precios' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    const count = await pool.query('SELECT COUNT(*) FROM fuel_price_history');

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        serverTime: result.rows[0].now,
        recordsInDB: parseInt(count.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Obtener historial filtrado de gasolineras
app.get('/api/fuel-prices/station-history', async (req, res) => {
  try {
    const {
      fuelType,
      province,
      city,
      brand,
      stationId,
      days
    } = req.query;

    const data = await getStationHistoryFiltered({
      fuelType,
      province,
      city,
      brand,
      stationId,
      days: days ? parseInt(days) : 365
    });

    // Convertir DECIMAL a números
    const formatted = data.map(record => ({
      ...record,
      price: record.price ? parseFloat(record.price) : null,
      avg_price: record.avg_price ? parseFloat(record.avg_price) : null,
      min_price: record.min_price ? parseFloat(record.min_price) : null,
      max_price: record.max_price ? parseFloat(record.max_price) : null,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error en /api/fuel-prices/station-history:', error);
    res.status(500).json({ error: 'Error al obtener historial de estaciones' });
  }
});

// Obtener opciones de filtros (provincias y marcas)
app.get('/api/fuel-prices/filter-options', async (req, res) => {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error en /api/fuel-prices/filter-options:', error);
    res.status(500).json({ error: 'Error al obtener opciones de filtros' });
  }
});

// Obtener ciudades por provincia
app.get('/api/fuel-prices/cities/:province', async (req, res) => {
  try {
    const { province } = req.params;
    const cities = await getCitiesByProvince(decodeURIComponent(province));
    res.json(cities);
  } catch (error) {
    console.error('Error en /api/fuel-prices/cities:', error);
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
});

// Obtener gasolineras por ciudad
app.get('/api/fuel-prices/stations/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { brand } = req.query;
    const stations = await getStationsByCity(decodeURIComponent(city), brand);
    res.json(stations);
  } catch (error) {
    console.error('Error en /api/fuel-prices/stations:', error);
    res.status(500).json({ error: 'Error al obtener estaciones' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Schedule daily price updates at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('⏰ Ejecutando actualización programada de precios...');
  try {
    await fetchAndStoreDailyPrices();
  } catch (error) {
    console.error('Error en actualización programada:', error);
  }
});

// Start server
const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    console.log('⏰ Actualización automática programada para las 2:00 AM diariamente');
  });
};

startServer();
