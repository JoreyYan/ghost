const { createClient } = require('@supabase/supabase-js')

// 测试不同的 URL 格式
const urls = [
  'https://kiwcuvmnlcldrmgskhrh.supabase.co',
  'https://kiwcuvmnlcldrmgskhrh.supabase.co/rest/v1/',
  'https://kiwcuvmnlcldrmgskhrh.supabase.co/api/v1/'
]

const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2N1dm1ubGNsZHJtZ3NraHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTYyNTEsImV4cCI6MjA3Mzg3MjI1MX0.-j1j_UHceUT3DVjPDzdJu-uGsEdI4d1dB2RlT_Pk_nc'

async function testUrls() {
  for (const url of urls) {
    console.log(`\nTesting URL: ${url}`)
    try {
      const supabase = createClient(url, key)
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Error: ${error.message}`)
      } else {
        console.log(`✅ Success! Found ${data?.length || 0} sources`)
        console.log('Sample data:', data?.[0])
        break // 找到正确的 URL 就停止
      }
    } catch (err) {
      console.log(`❌ Exception: ${err.message}`)
    }
  }
}

testUrls()
