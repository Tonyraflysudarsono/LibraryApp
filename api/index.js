const express = require('express');
const cors = require('cors');
const { sequelize } = require('../backend/models');

// Import routes from backend
const authRoutes = require('../backend/routes/authRoutes');
const bukuRoutes = require('../backend/routes/bukuRoutes');
const anggotaRoutes = require('../backend/routes/anggotaRoutes');
const kategoriRoutes = require('../backend/routes/kategoriRoutes');
const peminjamanRoutes = require('../backend/routes/peminjamanRoutes');
const dendaRoutes = require('../backend/routes/dendaRoutes');
const dashboardRoutes = require('../backend/routes/dashboardRoutes');
const hrRoutes = require('../backend/routes/hrRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in serverless logs
app.use((req, res, next) => {
  console.log(`[Vercel Serverless] ${req.method} ${req.url}`);
  next();
});

// Database connection & sync check middleware
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully in serverless context.');
      
      // Auto sync model structures (runs alter table if models changed)
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully in serverless context.');
      isConnected = true;
    } catch (err) {
      console.error('Database connection/sync error in serverless context:', err);
    }
  }
  next();
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/denda', dendaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hr', hrRoutes);

// Base API route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to AtmaLibrary API Server (Serverless on Vercel).' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Terjadi kesalahan internal pada serverless backend.', 
    error: err.message 
  });
});

module.exports = app;
