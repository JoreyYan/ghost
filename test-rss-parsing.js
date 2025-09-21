const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kiwcuvmnlcldrmgskhrh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2N1dm1ubGNsZHJtZ3NraHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTYyNTEsImV4cCI6MjA3Mzg3MjI1MX0.-j1j_UHceUT3DVjPDzdJu-uGsEdI4d1dB2RlT_Pk_nc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRSSParsing() {
  try {
    console.log('Testing RSS parsing...')
    
    const rssUrl = 'https://github.com/Peldom/papers_for_protein_design_using_DL/commits.atom'
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`
    
    console.log('Fetching from proxy:', proxyUrl)
    const response = await fetch(proxyUrl)
    
    if (!response.ok) {
      console.error('Proxy fetch failed:', response.statusText)
      return
    }
    
    const data = await response.json()
    let rssContent = data.contents
    
    // 检查是否是 base64 编码的内容
    if (rssContent.startsWith('data:application/atom+xml; charset=utf-8;base64,')) {
      const base64Data = rssContent.split(',')[1]
      rssContent = Buffer.from(base64Data, 'base64').toString('utf-8')
    }
    
    console.log('RSS content length:', rssContent.length)
    console.log('First 500 chars:', rssContent.substring(0, 500))
    
    // 解析 RSS/Atom feed
    const entryMatches = rssContent.match(/<entry[^>]*>[\s\S]*?<\/entry>/g) || 
                        rssContent.match(/<item[^>]*>[\s\S]*?<\/item>/g) || []
    
    console.log('Found entries:', entryMatches.length)
    
    const items = []
    for (let i = 0; i < Math.min(3, entryMatches.length); i++) {
      const entry = entryMatches[i]
      const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/i)
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*>/i) || 
                       entry.match(/<link[^>]*>([^<]*)<\/link>/i)
      const authorMatch = entry.match(/<author[^>]*>[\s\S]*?<name[^>]*>([^<]*)<\/name>[\s\S]*?<\/author>/i)
      const dateMatch = entry.match(/<updated[^>]*>([^<]*)<\/updated>/i) ||
                       entry.match(/<pubDate[^>]*>([^<]*)<\/pubDate>/i)
      
      if (titleMatch && linkMatch) {
        const item = {
          url: linkMatch[1],
          title: titleMatch[1].trim(),
          author: authorMatch ? authorMatch[1].trim() : 'Unknown',
          published_at: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          content: titleMatch[1].trim(),
          tags: ['commit', 'github'],
          metadata: {
            type: 'rss_item',
            source: 'github_commits_rss'
          }
        }
        items.push(item)
        console.log(`Item ${i + 1}:`, item.title, 'by', item.author)
      }
    }
    
    console.log('Parsed items:', items.length)
    
    // 检查数据库中是否已有这些项目
    const { data: existingItems, error: fetchError } = await supabase
      .from('items')
      .select('url')
      .in('url', items.map(item => item.url))

    if (fetchError) {
      console.error('Database query error:', fetchError)
      return
    }
    
    const existingUrls = new Set(existingItems?.map(item => item.url))
    const newItems = items.filter(item => !existingUrls.has(item.url))
    
    console.log('Existing items:', existingItems?.length || 0)
    console.log('New items:', newItems.length)
    
    if (newItems.length > 0) {
      console.log('New items to save:', newItems.map(item => item.title))
    }
    
  } catch (error) {
    console.error('RSS parsing error:', error)
  }
}

testRSSParsing()
