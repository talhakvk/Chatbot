'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
        return;
      }

      if (data?.user) {
        router.push('/');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <Image
          src="/kampüs2-scaled.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/firat-logo.png"
            alt="Fırat Üniversitesi Logo"
            width={150}
            height={150}
            priority
          />
        </div>
        
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Hoş Geldiniz</h1>
          <p className={styles.subtitle}>Hesabınıza giriş yapın</p>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                required
                disabled={loading}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                required
                disabled={loading}
              />
            </div>
            
            <div className={styles.rememberMe}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Beni hatırla</label>
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
          
          <div className={styles.links}>
            <a href="#" className={styles.forgotPassword}>
              Şifremi Unuttum
            </a>
            <a href="#" className={styles.signUp}>
              Hesap Oluştur
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 