'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import styles from './page.module.css';
import ChatBot from './components/ChatBot';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      console.error('Giriş hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <ChatBot />;
  }

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <div className="text-center mb-4">
          <Image
            src="/firat-logo.png"
            alt="Fırat Üniversitesi Logo"
            width={100}
            height={100}
            className={styles.logo}
          />
          <h2 className={`mt-3 ${styles.headerTitle}`}>Fırat Üniversitesi</h2>
          <h4 className={styles.headerSubtitle}>Chatbot Girişi</h4>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className={styles.formLabel}>E-posta</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className={styles.formLabel}>Şifre</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn ${styles['btn-maroon']} w-100`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Giriş Yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
