'use client';

import { useState } from 'react';

export default function Page() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);

  async function handleSendMessage() {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: newMessage,
          chat_id: chatId // Mevcut sohbet ID'sini gönder
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Yeni sohbet ID'sini kaydet
      if (data.chat_id) {
        setChatId(data.chat_id);
      }

      // Mesajları güncelle
      if (data.messages) {
        setMessages(data.messages);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'user', content: newMessage },
          { sender: 'bot', content: data.message }
        ]);
      }

      // Input alanını temizle
      setNewMessage('');
    } catch (error) {
      console.error('Hata:', error);
      alert('Mesaj gönderilirken bir hata oluştu: ' + error.message);
    }
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div 
        className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-100 ml-auto' 
                : 'bg-gray-100'
            }`}
            style={{ maxWidth: '80%' }}
          >
            {message.content || message.text}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Mesajınızı yazın..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
