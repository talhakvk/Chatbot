'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import styles from './page.module.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Önce Supabase Auth ile kullanıcıyı kaydet
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Users tablosuna kullanıcı bilgilerini ekle
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              username: formData.username,
              email: formData.email,
              role: 'user', // Sabit olarak 'user' rolü atanıyor
              created_at: new Date().toISOString(),
              auth_id: authData.user.id
            }
          ]);

        if (insertError) throw insertError;

        // 3. Başarılı kayıt sonrası login sayfasına yönlendir
        router.push('/');
      }
    } catch (error) {
        // Hata nesnesini stringe çevirerek konsola yazdır
        console.error('Kayıt hatası:', JSON.stringify(error));
        // Hata mesajı varsa onu göster, yoksa tüm hatayı string olarak göster
        setError('Kayıt işlemi başarısız: ' + (error?.message || JSON.stringify(error)));
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.signupBox}>
        <div className="text-center mb-4">
          <Image
            src="/firat-logo.png"
            alt="Fırat Üniversitesi Logo"
            width={100}
            height={100}
            className={styles.logo}
          />
          <h2 className={`mt-3 ${styles.headerTitle}`}>Fırat Üniversitesi</h2>
          <h4 className={styles.headerSubtitle}>Yeni Hesap Oluştur</h4>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className={styles.formLabel}>Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className={styles.formLabel}>E-posta</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className={styles.formLabel}>Şifre</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
                Kayıt Yapılıyor...
              </>
            ) : (
              'Kayıt Ol'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 