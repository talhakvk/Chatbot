import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
}

// Supabase bağlantı bilgileri
const supabaseUrl = 'https://saileswnncwihfvzswml.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase istemcisini oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Bağlantı durumunu kontrol et
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') console.log('Bağlantı başarılı!')
  if (event === 'SIGNED_OUT') console.log('Bağlantı kesildi!')
}) 