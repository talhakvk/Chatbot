// app/api/chat/route.js

import { saveMessage, getMessagesByChatId, createChat } from '@/lib/db-queries';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('API isteği başladı');
    const body = await request.json();
    console.log('İstek gövdesi:', body);

    const userMessage = body.message;
    let chat_id = body.chat_id;

    if (!userMessage) {
      console.log('Mesaj boş');
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      );
    }

    // Geçici olarak user_id=1 kullanıyoruz. Gerçek uygulamada bu değer oturum bilgisinden gelmeli
    const user_id = 1;

    try {
      // Eğer chat_id yoksa yeni bir sohbet oluştur
      if (!chat_id) {
        console.log('Yeni sohbet oluşturuluyor...');
        const newChat = await createChat(user_id);
        chat_id = newChat;
        console.log('Yeni sohbet ID:', chat_id);
      }

      console.log('Kullanıcı mesajı kaydediliyor...');
      // Kullanıcı mesajını veritabanına kaydet
      await saveMessage(chat_id, 'user', userMessage);
      console.log('Kullanıcı mesajı kaydedildi');

      // Bot yanıtını oluştur
      let botResponse = "Merhaba! Mesajınız alındı: " + userMessage;

      // Eğer ANYTHING_LLM_API_KEY mevcutsa, Chatbot API'sine istek gönder
      const apiKey = process.env.ANYTHING_LLM_API_KEY;
      console.log('API Key Kontrolü:', {
        apiKeyVarMi: !!apiKey,
        apiKeyUzunluk: apiKey ? apiKey.length : 0,
        tumCevreselDegiskenler: process.env
      });

      if (apiKey) {
        console.log('AnythingLLM API\'sine istek gönderiliyor...');
        const anythingLlmApiUrl = 'https://opljffc7.rpcld.cc/api/v1/workspace/chatbot/chat';
        
        try {
          console.log('API İstek Detayları:');
          console.log('URL:', anythingLlmApiUrl);
          console.log('API Key:', apiKey ? 'Mevcut' : 'Eksik');
          console.log('API Key Değeri:', apiKey);
          const requestBody = {
            message: userMessage,
            mode: "query",
            contextBehavior: "include",
            sessionId: chat_id.toString()
          };
          console.log('İstek Gövdesi:', JSON.stringify(requestBody, null, 2));

          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          };
          console.log('İstek Başlıkları:', JSON.stringify(headers, null, 2));

          const response = await fetch(anythingLlmApiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
          });

          console.log('API Yanıt Durumu:', response.status);
          console.log('API Yanıt Başlıkları:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));

          if (!response.ok) {
            const errorData = await response.text();
            console.error('API Hata Yanıtı:', errorData);
            try {
              const parsedError = JSON.parse(errorData);
              console.error('Ayrıştırılmış API Hatası:', JSON.stringify(parsedError, null, 2));
            } catch (e) {
              console.error('Ham API Hata Yanıtı:', errorData);
            }
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
          }

          const data = await response.json();
          console.log('API Yanıtı:', data);
          
          if (data.textResponse) {
            botResponse = data.textResponse;
          } else {
            throw new Error('API yanıtında textResponse bulunamadı');
          }
        } catch (error) {
          console.error('AnythingLLM API isteği sırasında hata:', error);
          botResponse = "Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.";
        }
      }

      console.log('Bot yanıtı kaydediliyor...');
      // Bot yanıtını veritabanına kaydet
      await saveMessage(chat_id, 'bot', botResponse);
      console.log('Bot yanıtı kaydedildi');

      console.log('Mesajlar getiriliyor...');
      // Sohbetin tüm mesajlarını getir
      const messages = await getMessagesByChatId(chat_id);
      console.log('Mesajlar:', messages);

      return NextResponse.json({
        message: botResponse,
        chat_id: chat_id,
        messages: messages
      }, { status: 200 });
    } catch (dbError) {
      console.error('Veritabanı işlemi sırasında hata:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı hatası: ' + dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API isteği işlenirken hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenirken hata: ' + error.message },
      { status: 500 }
    );
  }
}