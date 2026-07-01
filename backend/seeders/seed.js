const bcrypt = require('bcryptjs');
const { sequelize, Admin, Anggota, Kategori, Buku, Karyawan, Kehadiran } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Force sync database to clear old tables
    await sequelize.sync({ force: true });
    console.log('Database synced (force: true).');

    // 1. Seed Admin
    const adminSalt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('password', adminSalt);
    
    const adminUser = await Admin.create({
      nama_admin: 'Admin Perpustakaan',
      username: 'ADM001',
      password: hashedAdminPassword,
      email: 'admin@atmalibrary.org',
    });
    console.log('Admin seeded.');

    // 2. Seed Anggota
    const memberSalt = await bcrypt.genSalt(10);
    const hashedMemberPassword = await bcrypt.hash('password', memberSalt);

    const members = await Anggota.bulkCreate([
      {
        nama_anggota: 'Adrian Wijaya',
        no_identitas: 'MEM001',
        email: 'adrian@atmalibrary.org',
        telepon: '+62 812-3456-7890',
        password: hashedMemberPassword,
        status_anggota: 'active',
      },
      {
        nama_anggota: 'Budi Santoso',
        no_identitas: 'MEM002',
        email: 'budi@atmalibrary.org',
        telepon: '+62 813-4567-8901',
        password: hashedMemberPassword,
        status_anggota: 'active',
      },
      {
        nama_anggota: 'Citra Lestari',
        no_identitas: 'MEM003',
        email: 'citra@atmalibrary.org',
        telepon: '+62 814-5678-9012',
        password: hashedMemberPassword,
        status_anggota: 'active',
      },
    ]);
    console.log('Anggota (Members) seeded.');

    // 3. Seed Kategori
    const categoriesData = [
      { nama_kategori: 'Design', deskripsi: 'Buku tentang UI/UX, Desain Grafis, dan Desain Produk.' },
      { nama_kategori: 'Technology', deskripsi: 'Buku Pemrograman, Kecerdasan Buatan, dan Rekayasa Perangkat Lunak.' },
      { nama_kategori: 'History', deskripsi: 'Buku Sejarah Manusia, Bangsa, dan Dunia.' },
      { nama_kategori: 'Business', deskripsi: 'Buku tentang Bisnis, Startup, Finansial, dan Manajemen.' },
      { nama_kategori: 'Self-Improvement', deskripsi: 'Buku tentang Pengembangan Diri dan Motivasi.' },
      { nama_kategori: 'Fiction', deskripsi: 'Buku Novel Sastra dan Cerita Fiksi.' },
      { nama_kategori: 'Children', deskripsi: 'Buku Cerita dan Pendidikan Anak-anak.' },
      { nama_kategori: 'Teen', deskripsi: 'Buku Novel Remaja dan Edukasi Populer.' },
    ];

    const categories = await Kategori.bulkCreate(categoriesData);
    console.log('Kategori seeded.');

    // Helper map category name to database ID
    const catMap = {};
    categories.forEach(c => {
      catMap[c.nama_kategori] = c.id_kategori;
    });

    // 4. Seed Buku (14 books matching mockDb)
    const booksData = [
      {
        judul: 'The Design of Everyday Things',
        pengarang: 'Don Norman',
        penerbit: 'Basic Books',
        id_kategori: catMap['Design'],
        tahun: 2013,
        stok_tersedia: 3,
        stok_maksimal: 5,
        deskripsi: 'A deep-dive into the cognitive psychology behind good design, explaining why some products satisfy customers while others frustrate them.',
        cover_seed: 'normandesign',
        kode_buku: 'DES-0001',
      },
      {
        judul: 'Refactoring: Improving the Design of Existing Code',
        pengarang: 'Martin Fowler',
        penerbit: 'Addison-Wesley',
        id_kategori: catMap['Technology'],
        tahun: 2018,
        stok_tersedia: 2,
        stok_maksimal: 4,
        deskripsi: 'The definitive guide to refactoring patterns, showing developers how to restructure code without changing its external behavior.',
        cover_seed: 'refactoring',
        kode_buku: 'TEC-0001',
      },
      {
        judul: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        pengarang: 'Robert C. Martin',
        penerbit: 'Prentice Hall',
        id_kategori: catMap['Technology'],
        tahun: 2008,
        stok_tersedia: 0,
        stok_maksimal: 3,
        deskripsi: 'A handbook containing practical rules and real-world case studies for writing elegant, clean, and maintainable software.',
        cover_seed: 'cleancode',
        kode_buku: 'TEC-0002',
      },
      {
        judul: 'Sapiens: A Brief History of Humankind',
        pengarang: 'Yuval Noah Harari',
        penerbit: 'Harper',
        id_kategori: catMap['History'],
        tahun: 2015,
        stok_tersedia: 4,
        stok_maksimal: 6,
        deskripsi: 'An exploration of the history of humans from the evolution of archaic human species in the Stone Age up to the twenty-first century.',
        cover_seed: 'sapiens',
        kode_buku: 'HIS-0001',
      },
      {
        judul: 'Zero to One: Notes on Startups, or How to Build the Future',
        pengarang: 'Peter Thiel',
        penerbit: 'Crown Business',
        id_kategori: catMap['Business'],
        tahun: 2014,
        stok_tersedia: 2,
        stok_maksimal: 2,
        deskripsi: 'An optimistic view of the future of progress in America and a new way of thinking about innovation: it starts by learning to think for yourself.',
        cover_seed: 'zerotoone',
        kode_buku: 'BUS-0001',
      },
      {
        judul: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
        pengarang: 'James Clear',
        penerbit: 'Avery',
        id_kategori: catMap['Self-Improvement'],
        tahun: 2018,
        stok_tersedia: 5,
        stok_maksimal: 5,
        deskripsi: 'A practical framework for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.',
        cover_seed: 'atomichabits',
        kode_buku: 'SEL-0001',
      },
      {
        judul: 'Infinite Ladders: Reaching the Sky of Innovation',
        pengarang: 'Christopher Epstein',
        penerbit: 'Crown Publishing',
        id_kategori: catMap['Self-Improvement'],
        tahun: 2021,
        stok_tersedia: 2,
        stok_maksimal: 4,
        deskripsi: 'A study on architectural logic and creative innovation to reach ladders of career growth.',
        cover_seed: 'ladders',
        kode_buku: 'SEL-0002',
      },
      {
        judul: 'My Dear Buddy: A Tale of Friendship and Loyalty',
        pengarang: 'Jonathan Kent',
        penerbit: 'Penguin Books',
        id_kategori: catMap['Fiction'],
        tahun: 2020,
        stok_tersedia: 3,
        stok_maksimal: 3,
        deskripsi: 'A moving narrative of friendship, emotional bonding, and lifelong loyalty.',
        cover_seed: 'buddy',
        kode_buku: 'FIC-0001',
      },
      {
        judul: 'The Little Prince',
        pengarang: 'Antoine de Saint-Exupéry',
        penerbit: 'Reynal & Hitchcock',
        id_kategori: catMap['Children'],
        tahun: 1943,
        stok_tersedia: 4,
        stok_maksimal: 4,
        deskripsi: 'Sebuah cerita klasik tentang seorang pangeran muda yang mengunjungi berbagai planet di luar angkasa, termasuk Bumi, dan membahas tema persahabatan, cinta, dan kehilangan.',
        cover_seed: 'littleprince',
        kode_buku: 'CHI-0001',
      },
      {
        judul: "Alice's Adventures in Wonderland",
        pengarang: 'Lewis Carroll',
        penerbit: 'Macmillan',
        id_kategori: catMap['Children'],
        tahun: 1865,
        stok_tersedia: 3,
        stok_maksimal: 3,
        deskripsi: 'Kisah petualangan Alice yang jatuh ke dalam lubang kelinci dan memasuki dunia fantasi aneh yang dihuni oleh makhluk-makhluk antropomorfik yang tidak biasa.',
        cover_seed: 'alice',
        kode_buku: 'CHI-0002',
      },
      {
        judul: "Harry Potter and the Sorcerer's Stone",
        pengarang: 'J.K. Rowling',
        penerbit: 'Scholastic',
        id_kategori: catMap['Teen'],
        tahun: 1997,
        stok_tersedia: 5,
        stok_maksimal: 5,
        deskripsi: 'Kisah seorang anak yatim piatu bernama Harry Potter yang mengetahui bahwa dirinya adalah seorang penyihir pada hari ulang tahunnya yang ke-11 dan bersekolah di Hogwarts.',
        cover_seed: 'harrypotter1',
        kode_buku: 'TEEN-0001',
      },
      {
        judul: 'The Hobbit',
        pengarang: 'J.R.R. Tolkien',
        penerbit: 'George Allen & Unwin',
        id_kategori: catMap['Teen'],
        tahun: 1937,
        stok_tersedia: 2,
        stok_maksimal: 2,
        deskripsi: 'Petualangan Bilbo Baggins, seorang hobbit yang menyukai kenyamanan, yang dipaksa keluar dari rumahnya untuk membantu sekelompok kurcaci merebut kembali gunung mereka dari naga Smaug.',
        cover_seed: 'hobbit',
        kode_buku: 'TEEN-0002',
      },
      {
        judul: 'Peter Pan',
        pengarang: 'J.M. Barrie',
        penerbit: 'Hodder & Stoughton',
        id_kategori: catMap['Children'],
        tahun: 1911,
        stok_tersedia: 3,
        stok_maksimal: 3,
        deskripsi: 'Kisah petualangan Peter Pan, anak laki-laki yang menolak untuk tumbuh dewasa, bersama Wendy dan saudara-saudaranya di pulau ajaib Neverland.',
        cover_seed: 'peterpan',
        kode_buku: 'CHI-0003',
      },
      {
        judul: 'Percy Jackson: The Lightning Thief',
        pengarang: 'Rick Riordan',
        penerbit: 'Miramax Books',
        id_kategori: catMap['Teen'],
        tahun: 2005,
        stok_tersedia: 4,
        stok_maksimal: 4,
        deskripsi: 'Percy Jackson, seorang anak laki-laki berusia 12 tahun yang menderita disleksia, menemukan bahwa dirinya adalah seorang demigod, putra dari dewa Poseidon, dan dituduh mencuri petir Zeus.',
        cover_seed: 'percyjackson',
        kode_buku: 'TEEN-0003',
      },
    ];

    await Buku.bulkCreate(booksData);
    console.log('Buku seeded.');

    // 5. Seed Karyawan
    const employees = await Karyawan.bulkCreate([
      {
        nama_karyawan: 'Rina Kusuma',
        nip: '199201152024012001',
        email: 'rina.kusuma@atmalibrary.org',
        telepon: '0812-3344-5566',
        jabatan: 'Pustakawan Utama',
        departemen: 'Sirkulasi',
        tanggal_masuk: '2024-01-15',
        status: 'active',
        gaji: 4500000.00,
      },
      {
        nama_karyawan: 'Eko Prasetyo',
        nip: '198911102023111002',
        email: 'eko.prasetyo@atmalibrary.org',
        telepon: '0813-4455-6677',
        jabatan: 'Staff IT & Sistem Informasi',
        departemen: 'IT',
        tanggal_masuk: '2023-11-10',
        status: 'active',
        gaji: 5500000.00,
      },
      {
        nama_karyawan: 'Sari Wulandari',
        nip: '199403012024032003',
        email: 'sari.wulandari@atmalibrary.org',
        telepon: '0814-5566-7788',
        jabatan: 'Staf Referensi & Koleksi',
        departemen: 'Referensi',
        tanggal_masuk: '2024-03-01',
        status: 'active',
        gaji: 4500000.00,
      },
      {
        nama_karyawan: 'Bambang Setiawan',
        nip: '198505202022051004',
        email: 'bambang.s@atmalibrary.org',
        telepon: '0812-9988-7766',
        jabatan: 'Koordinator Keamanan',
        departemen: 'Umum',
        tanggal_masuk: '2022-05-20',
        status: 'active',
        gaji: 3800000.00,
      },
      {
        nama_karyawan: 'Dewi Anggraini',
        nip: '199606152023062005',
        email: 'dewi.anggraini@atmalibrary.org',
        telepon: '0813-8877-6655',
        jabatan: 'Staf Kebersihan',
        departemen: 'Umum',
        tanggal_masuk: '2023-06-15',
        status: 'active',
        gaji: 3500000.00,
      },
    ]);
    console.log('Karyawan (Employees) seeded.');

    // 6. Seed Kehadiran (Last 7 days, excluding Sundays, mostly 'hadir' with some 'izin'/'sakit'/'alpha')
    console.log('Seeding attendance data for the last 7 days...');
    const attendanceRecords = [];
    const today = new Date();
    
    // We seed attendance for 7 dates
    let datesGenerated = 0;
    let daysOffset = 0;

    while (datesGenerated < 7) {
      const date = new Date(today);
      date.setDate(today.getDate() - daysOffset);
      
      // Skip Sundays
      if (date.getDay() !== 0) {
        const dateStr = date.toISOString().split('T')[0];

        employees.forEach((emp) => {
          // Determine attendance status randomly but realistically
          let status = 'hadir';
          let jam_masuk = '08:00:00';
          let jam_keluar = '16:00:00';
          let keterangan = '';

          // Add some randomness (e.g. Sari Wulandari had 1 sakit day, Bambang Setiawan had 1 izin day)
          const rand = Math.random();
          if (emp.nama_karyawan === 'Sari Wulandari' && datesGenerated === 2) {
            status = 'sakit';
            jam_masuk = null;
            jam_keluar = null;
            keterangan = 'Sakit Demam';
          } else if (emp.nama_karyawan === 'Bambang Setiawan' && datesGenerated === 4) {
            status = 'izin';
            jam_masuk = null;
            jam_keluar = null;
            keterangan = 'Keperluan Keluarga';
          } else if (rand > 0.96) {
            status = 'alpha';
            jam_masuk = null;
            jam_keluar = null;
            keterangan = 'Tanpa Keterangan';
          } else if (rand > 0.90) {
            status = 'hadir';
            jam_masuk = '08:25:00'; // Late check-in
            jam_keluar = '16:05:00';
            keterangan = 'Terlambat karena macet';
          }

          attendanceRecords.push({
            id_karyawan: emp.id_karyawan,
            tanggal: dateStr,
            jam_masuk,
            jam_keluar,
            status,
            keterangan,
          });
        });
        datesGenerated++;
      }
      daysOffset++;
    }

    await Kehadiran.bulkCreate(attendanceRecords);
    console.log(`Successfully seeded ${attendanceRecords.length} attendance records.`);
    console.log('Database seeding completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
