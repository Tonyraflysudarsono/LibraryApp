require('dotenv').config();
const mysql = require('mysql2/promise');

const inspectDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'atma_library_db',
    });

    console.log('=== ATMA LIBRARY DATABASE INSPECTION ===\n');

    // Get list of tables
    const [tables] = await connection.query('SHOW TABLES;');
    const tableField = `Tables_in_${process.env.DB_NAME || 'atma_library_db'}`;

    for (const tableObj of tables) {
      const tableName = tableObj[tableField];
      console.log(`\nTable: ${tableName}`);
      console.log('-'.repeat(tableName.length + 7));

      // Describe table
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\`;`);
      console.log('Column name'.padEnd(25) + ' | ' + 'Type'.padEnd(20) + ' | ' + 'Null'.padEnd(5) + ' | ' + 'Key'.padEnd(4) + ' | ' + 'Default');
      console.log('-'.repeat(70));
      for (const col of columns) {
        console.log(
          col.Field.padEnd(25) + ' | ' + 
          col.Type.padEnd(20) + ' | ' + 
          col.Null.padEnd(5) + ' | ' + 
          (col.Key || '').padEnd(4) + ' | ' + 
          (col.Default === null ? 'NULL' : col.Default)
        );
      }
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error inspecting database:', error);
    process.exit(1);
  }
};

inspectDb();
