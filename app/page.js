'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [data, setData] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, sender, content, timestamp')
          .order('timestamp', { ascending: true });
        
        if (error) {
          throw error;
        }

        setData(data || []);
        setMessages(data || []);
      } catch (err) {
        console.error('Veri çekme hatası:', err);
        setError(err.message);
      }
    }

    fetchData();
  }, []);

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
          chat_id: chatId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.chat_id) {
        setChatId(data.chat_id);
      }

      if (data.messages) {
        setMessages(data.messages);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'user', content: newMessage },
          { sender: 'bot', content: data.message }
        ]);
      }

      setNewMessage('');
      setError(null);
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
      setError(err.message);
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-500">Hata oluştu!</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sohbet Uygulaması</h1>
      
      <div className="flex flex-col h-[80vh]">
        <div 
          className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-100 ml-auto' 
                  : 'bg-white'
              } max-w-[80%] shadow-sm`}
            >
              <div className="text-sm text-gray-500 mb-1">
                {message.sender === 'user' ? 'Siz' : 'Bot'}
              </div>
              <div>{message.content}</div>
              {message.timestamp && (
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mesajınızı yazın..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Gönder
          </button>
        </div>
      </div>
    </main>
  );
}
