// lib/db.js

import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Connection URL'ini parse et
const connectionString = process.env.DATABASE_URL;

// PostgreSQL bağlantı havuzu oluştur
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // SSL sertifikasını doğrulamayı devre dışı bırakır
  },
});

// Bağlantıyı test et
async function testConnection() {
  let client;
  try {
    console.log('Veritabanı bağlantısı test ediliyor...');
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Veritabanı bağlantısı başarılı:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
    console.error('Hata detayları:', err);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Test bağlantısını çalıştır
testConnection();

// Export the pool instance
export { pool, testConnection };