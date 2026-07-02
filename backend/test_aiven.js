require('dotenv').config();
const { Admin, Anggota } = require('./models');

const test = async () => {
  try {
    console.log('Connecting to database...');
    const admins = await Admin.findAll();
    console.log('\n--- Admins in Database ---');
    admins.forEach(a => {
      console.log(`ID: ${a.id_admin}, Name: ${a.nama_admin}, Username: ${a.username}, Email: ${a.email}`);
    });

    const members = await Anggota.findAll();
    console.log('\n--- Members in Database ---');
    members.forEach(m => {
      console.log(`ID: ${m.id_anggota}, Name: ${m.nama_anggota}, ID_No: ${m.no_identitas}, Email: ${m.email}`);
    });

    console.log('\nDone testing database connection!');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to remote database:', error);
    process.exit(1);
  }
};

test();
