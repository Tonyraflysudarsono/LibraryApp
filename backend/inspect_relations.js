require('dotenv').config();
const mysql = require('mysql2/promise');

const inspectRelations = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'atma_library_db',
    });

    console.log('=== ATMA LIBRARY FOREIGN KEY RELATIONSHIPS ===\n');

    const query = `
      SELECT 
        TABLE_NAME, 
        COLUMN_NAME, 
        CONSTRAINT_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME 
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE 
        TABLE_SCHEMA = ? 
        AND REFERENCED_TABLE_NAME IS NOT NULL;
    `;

    const [relations] = await connection.query(query, [process.env.DB_NAME || 'atma_library_db']);

    console.log('Table Source'.padEnd(20) + ' | ' + 'FK Column'.padEnd(15) + ' | ' + 'Referenced Table'.padEnd(20) + ' | ' + 'PK Column'.padEnd(15) + ' | ' + 'Constraint Name');
    console.log('-'.repeat(95));

    for (const rel of relations) {
      console.log(
        rel.TABLE_NAME.padEnd(20) + ' | ' + 
        rel.COLUMN_NAME.padEnd(15) + ' | ' + 
        rel.REFERENCED_TABLE_NAME.padEnd(20) + ' | ' + 
        rel.REFERENCED_COLUMN_NAME.padEnd(15) + ' | ' + 
        rel.CONSTRAINT_NAME
      );
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error inspecting relationships:', error);
    process.exit(1);
  }
};

inspectRelations();
