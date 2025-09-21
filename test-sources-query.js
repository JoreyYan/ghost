const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kiwcuvmnlcldrmgskhrh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2N1dm1ubGNsZHJtZ3NraHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTYyNTEsImV4cCI6MjA3Mzg3MjI1MX0.-j1j_UHceUT3DVjPDzdJu-uGsEdI4d1dB2RlT_Pk_nc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSourcesQuery() {
  try {
    console.log('Testing sources query...')
    
    // 测试基本查询
    const { data: basicData, error: basicError } = await supabase
      .from('sources')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (basicError) {
      console.error('Basic query error:', basicError)
      return
    }
    
    console.log('Basic query successful!')
    console.log('Sources found:', basicData.length)
    console.log('Sample source:', basicData[0])
    
    // 测试带关联表的查询
    const { data: joinData, error: joinError } = await supabase
      .from('sources')
      .select(`
        *,
        source_categories (
          categories (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    if (joinError) {
      console.error('Join query error:', joinError)
      console.log('This means source_categories or categories table might not exist')
    } else {
      console.log('Join query successful!')
      console.log('Join data:', joinData[0])
    }
    
    // 检查表是否存在
    const tables = ['sources', 'categories', 'source_categories']
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`Table ${table}: NOT EXISTS`)
      } else {
        console.log(`Table ${table}: EXISTS`)
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testSourcesQuery()
