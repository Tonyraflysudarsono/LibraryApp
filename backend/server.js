require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bukuRoutes = require('./routes/bukuRoutes');
const anggotaRoutes = require('./routes/anggotaRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');
const dendaRoutes = require('./routes/dendaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const hrRoutes = require('./routes/hrRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AtmaLibrary API Server.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.', error: err.message });
});

// Database connection & sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync database models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();
