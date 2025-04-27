const { Pool } = require('pg');

// PostgreSQL bağlantı havuzu oluştur
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Bağlantıyı test et
pool.connect((err, client, release) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err.stack);
    return;
  }
  console.log('Veritabanına başarıyla bağlanıldı');
  release();
});

module.exports = pool; 