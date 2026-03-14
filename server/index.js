import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

import pool from './db/index.js';
import { fetchAndStoreDailyPrices, getPriceHistory } from './services/fuelPriceService.js';

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

// Initialize database schema
const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✅ Esquema de base de datos inicializado');

    // Fetch initial data
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
    res.json(history);
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
