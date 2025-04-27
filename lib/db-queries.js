const { pool } = require('./db');

/**
 * Yeni kullanıcı oluşturur
 * @param {string} username - Kullanıcı adı
 * @param {string} email - E-posta adresi
 * @param {string} password_hash - Hashlenmiş şifre
 * @returns {Promise<number>} - Oluşturulan kullanıcının ID'si
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function createUser(username, email, password_hash) {
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password_hash]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata:', error);
    throw error;
  }
}

/**
 * E-posta adresine göre kullanıcı bulur
 * @param {string} email - Arama yapılacak e-posta adresi
 * @returns {Promise<Object|null>} - Bulunan kullanıcı objesi veya null
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function findUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Kullanıcı aranırken hata:', error);
    throw error;
  }
}

/**
 * ID'ye göre kullanıcı bulur
 * @param {number} id - Arama yapılacak kullanıcı ID'si
 * @returns {Promise<Object|null>} - Bulunan kullanıcı objesi veya null
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function findUserById(id) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Kullanıcı aranırken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir sohbet oluşturur
 * @param {number} user_id - Sohbeti oluşturan kullanıcının ID'si
 * @returns {Promise<number>} - Oluşturulan sohbetin ID'si
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function createChat(user_id) {
  try {
    const result = await pool.query(
      'INSERT INTO chats (user_id) VALUES ($1) RETURNING id',
      [user_id]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Sohbet oluşturulurken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir mesaj kaydeder
 * @param {number} chat_id - Mesajın ait olduğu sohbetin ID'si
 * @param {string} sender - Mesajı gönderen (user veya assistant)
 * @param {string} content - Mesaj içeriği
 * @returns {Promise<void>}
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function saveMessage(chat_id, sender, content) {
  try {
    await pool.query(
      'INSERT INTO messages (chat_id, sender, content) VALUES ($1, $2, $3)',
      [chat_id, sender, content]
    );
  } catch (error) {
    console.error('Mesaj kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir sohbete ait tüm mesajları getirir
 * @param {number} chat_id - Mesajların getirileceği sohbetin ID'si
 * @returns {Promise<Array>} - Mesaj listesi
 * @throws {Error} - Veritabanı hatası durumunda
 */
async function getMessagesByChatId(chat_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
      [chat_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Mesajlar getirilirken hata:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  createChat,
  saveMessage,
  getMessagesByChatId
};

