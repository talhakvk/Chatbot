// lib/db-queries.js

import { supabase } from './supabase';

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
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username, 
        email, 
        password_hash,
        role: 'user' // Varsayılan rol
      }])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
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
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Kullanıcı aranırken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir sohbet oluşturur
 * @param {number} user_id - Sohbeti oluşturan kullanıcının ID'si
 * @returns {Promise<number>} - Oluşturulan sohbetin ID'si
 */
async function createChat(user_id) {
  try {
    console.log('createChat çağrıldı, user_id:', user_id);
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id }])
      .select('id')
      .single();

    if (error) throw error;
    console.log('Sohbet oluşturuldu, sonuç:', data);
    return data.id;
  } catch (error) {
    console.error('Sohbet oluşturulurken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir mesaj kaydeder
 * @param {number} chat_id - Mesajın ait olduğu sohbet ID'si
 * @param {string} sender - Mesajı gönderen (user veya bot)
 * @param {string} content - Mesaj içeriği
 * @returns {Promise<void>}
 */
async function saveMessage(chat_id, sender, content) {
  try {
    console.log('saveMessage çağrıldı:', { chat_id, sender, content });
    const date = new Date();
    const istanbulTime = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        chat_id: parseInt(chat_id), 
        sender, 
        content,
        timestamp: istanbulTime.toISOString() // Türkiye saatiyle kayıt
      }]);

    if (error) throw error;
    console.log('Mesaj kaydedildi');
  } catch (error) {
    console.error('Mesaj kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir sohbete ait tüm mesajları getirir
 * @param {number} chat_id - Mesajların getirileceği sohbet ID'si
 * @returns {Promise<Array>} - Mesaj listesi
 */
async function getMessagesByChatId(chat_id) {
  try {
    console.log('getMessagesByChatId çağrıldı, chat_id:', chat_id);
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender, content, timestamp')
      .eq('chat_id', parseInt(chat_id))
      .order('timestamp', { ascending: true });

    if (error) throw error;
    console.log('Mesajlar getirildi, sayı:', data.length);
    return data;
  } catch (error) {
    console.error('Mesajlar getirilirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir kullanıcıya ait tüm sohbet geçmişini getirir
 * @param {string} user_id - Kullanıcı ID'si (UUID veya int olabilir)
 * @returns {Promise<Array>} - Her biri {chat, messages} objesi olan sohbet geçmişi
 */
async function getChatHistoryByUserId(user_id) {
  try {
    // Önce kullanıcının tüm chatlerini al
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('id, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (chatsError) throw chatsError;
    if (!chats || chats.length === 0) return [];

    // Her chat için mesajları getir
    const history = [];
    for (const chat of chats) {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, sender, content, timestamp')
        .eq('chat_id', chat.id)
        .order('timestamp', { ascending: true });
      if (messagesError) throw messagesError;
      history.push({ chat, messages });
    }
    return history;
  } catch (error) {
    console.error('Kullanıcı sohbet geçmişi getirilirken hata:', error);
    throw error;
  }
}

export {
  createUser,
  findUserByEmail,
  findUserById,
  createChat,
  saveMessage,
  getMessagesByChatId,
  getChatHistoryByUserId
};