import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kiwcuvmnlcldrmgskhrh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2N1dm1ubGNsZHJtZ3NraHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTYyNTEsImV4cCI6MjA3Mzg3MjI1MX0.-j1j_UHceUT3DVjPDzdJu-uGsEdI4d1dB2RlT_Pk_nc'

// 调试信息
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// For server-side operations (API routes, server actions)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)


