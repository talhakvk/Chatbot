'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ChatBot = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Otomatik kaydırma için useEffect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Kullanıcıya göre mesajları çek
  useEffect(() => {
    async function fetchMessages() {
      if (!userId) return;
      try {
        const response = await fetch(`/api/chat?user_id=${userId}`);
        if (!response.ok) throw new Error('Sohbet geçmişi alınamadı');
        const data = await response.json();
        if (data.history && data.history.length > 0) {
          // Son sohbetin ID'sini al
          const lastChat = data.history[0];
          setChatId(lastChat.chat.id);
          // Son sohbetin mesajlarını göster
          const formattedMessages = lastChat.messages.map(msg => ({
            id: msg.id,
            type: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([
            {
              id: 1,
              type: 'bot',
              content: 'Merhaba! Size nasıl yardımcı olabilirim?',
              timestamp: new Date()
            }
          ]);
        }
      } catch (error) {
        console.error('Mesajları çekme hatası:', error);
      }
    }
    fetchMessages();
  }, [userId]);

  // Mesaj gönderme işlemi
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const timestamp = new Date();
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp
    };

    // Önce kullanıcı mesajını UI'da göster
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // API'ye istek gönder
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputMessage,
          chat_id: chatId,
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }

      const data = await response.json();

      // Chat ID'yi güncelle
      if (data.chat_id) {
        setChatId(data.chat_id);
      }

      // Bot mesajını ekle
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış fonksiyonu
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/'; // Tam sayfa yenilemeli yönlendirme
    } else {
      alert('Çıkış sırasında bir hata oluştu!');
      console.error(error);
    }
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="container-fluid p-0">
        <div className="header-container">
          <Image
            src="/firat-logo.png"
            alt="Fırat Üniversitesi Logo"
            width={120}
            height={120}
            className="logo"
          />
          <h1 className="header-title">Fırat Üniversitesi Chatbot</h1>
          <p className="header-subtitle">
            Üniversite bilgi ve hizmetlerine erişim için akıllı asistanınız.
          </p>
          <button onClick={handleLogout} className="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            Çıkış Yap
          </button>
        </div>
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <h1>Fırat Üniversitesi Chatbot</h1>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'}`}
              >
                <div className={`message-content ${message.isError ? 'bg-danger text-white' : ''}`}>
                  {message.content}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message message-bot">
                <div className="message-content d-flex align-items-center gap-2">
                  <span>Yazıyor</span>
                  <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input">
            <div className="container">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mesajınızı yazın..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                />
                <button
                  className="btn btn-maroon d-flex align-items-center gap-2"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {isLoading ? (
                    <>
                      <span>Gönderiliyor</span>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>Gönder</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <p className="footer-text">© 2025 Fırat Üniversitesi. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </>
  );
};


export default ChatBot; 