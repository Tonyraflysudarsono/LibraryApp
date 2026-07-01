require('dotenv').config();
const mysql = require('mysql2/promise');

const createDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    const dbName = process.env.DB_NAME || 'atma_library_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
};

createDb();
