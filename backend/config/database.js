require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'atma_library_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log if debugging SQL queries
    define: {
      timestamps: true, // Auto-create createdAt and updatedAt
      freezeTableName: true, // Model name matches table name exactly
    },
    timezone: '+07:00', // Matches Western Indonesian Time (WIB)
  }
);

module.exports = sequelize;
