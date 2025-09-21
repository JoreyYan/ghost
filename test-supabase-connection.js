const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kiwcuvmnlcldrmgskhrh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2N1dm1ubGNsZHJtZ3NraHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTYyNTEsImV4cCI6MjA3Mzg3MjI1MX0.-j1j_UHceUT3DVjPDzdJu-uGsEdI4d1dB2RlT_Pk_nc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // 测试连接
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Connection error:', error)
    } else {
      console.log('Connection successful!')
      console.log('Sample data:', data)
    }
    
    // 检查表结构
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'sources' })
    
    if (columnsError) {
      console.log('Cannot get table structure via RPC, trying direct query...')
      // 尝试直接查询
      const { data: directData, error: directError } = await supabase
        .from('sources')
        .select('*')
        .limit(0)
      
      if (directError) {
        console.error('Direct query error:', directError)
      } else {
        console.log('Direct query successful')
      }
    } else {
      console.log('Table columns:', columns)
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection()
