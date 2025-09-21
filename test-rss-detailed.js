const rssUrl = 'https://github.com/Peldom/papers_for_protein_design_using_DL/commits.atom'

async function testRSSParsing() {
  try {
    console.log('Testing RSS parsing for:', rssUrl)
    
    // 使用 CORS 代理
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`
    console.log('Fetching via proxy:', proxyUrl)
    
    const response = await fetch(proxyUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`)
    }
    
    const data = await response.json()
    let rssContent = data.contents
    
    console.log('Raw content length:', rssContent.length)
    console.log('Content starts with:', rssContent.substring(0, 200))
    
    // 检查是否 base64 编码
    if (rssContent.startsWith('data:application/atom+xml; charset=utf-8;base64,')) {
      console.log('Content is base64 encoded, decoding...')
      const base64Data = rssContent.split(',')[1]
      rssContent = Buffer.from(base64Data, 'base64').toString('utf-8')
      console.log('Decoded content length:', rssContent.length)
    }
    
    // 解析 RSS 内容
    const items = []
    
    // 尝试匹配 entry 标签
    const entryMatches = rssContent.match(/<entry[^>]*>[\s\S]*?<\/entry>/g) || 
                        rssContent.match(/<item[^>]*>[\s\S]*?<\/item>/g) || []
    
    console.log('Found entries:', entryMatches.length)
    
    for (let i = 0; i < Math.min(3, entryMatches.length); i++) {
      const entry = entryMatches[i]
      console.log(`\n--- Entry ${i + 1} ---`)
      console.log('Entry content:', entry.substring(0, 500))
      
      const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/i)
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*>/i) || 
                       entry.match(/<link[^>]*>([^<]*)<\/link>/i)
      const authorMatch = entry.match(/<author[^>]*>[\s\S]*?<name[^>]*>([^<]*)<\/name>[\s\S]*?<\/author>/i) ||
                         entry.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/i)
      const dateMatch = entry.match(/<updated[^>]*>([^<]*)<\/updated>/i) ||
                       entry.match(/<pubDate[^>]*>([^<]*)<\/pubDate>/i)
      const contentMatch = entry.match(/<content[^>]*>([^<]*)<\/content>/i) ||
                          entry.match(/<description[^>]*>([^<]*)<\/description>/i)
      
      console.log('Title match:', titleMatch ? titleMatch[1] : 'NOT FOUND')
      console.log('Link match:', linkMatch ? linkMatch[1] : 'NOT FOUND')
      console.log('Author match:', authorMatch ? authorMatch[1] : 'NOT FOUND')
      console.log('Date match:', dateMatch ? dateMatch[1] : 'NOT FOUND')
      console.log('Content match:', contentMatch ? contentMatch[1] : 'NOT FOUND')
      
      if (titleMatch && linkMatch) {
        items.push({
          url: linkMatch[1],
          title: titleMatch[1].trim(),
          author: authorMatch ? authorMatch[1].trim() : 'Unknown',
          published_at: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          content: contentMatch ? contentMatch[1].trim() : titleMatch[1].trim(),
          tags: ['commit', 'github'],
          metadata: {
            type: 'rss_item',
            source: 'github_commits_rss'
          }
        })
      }
    }
    
    console.log('\n=== Parsed Items ===')
    console.log('Total items parsed:', items.length)
    items.forEach((item, index) => {
      console.log(`\nItem ${index + 1}:`)
      console.log('  Title:', item.title)
      console.log('  URL:', item.url)
      console.log('  Author:', item.author)
      console.log('  Date:', item.published_at)
      console.log('  Content:', item.content.substring(0, 100) + '...')
    })
    
  } catch (error) {
    console.error('RSS parsing test failed:', error)
  }
}

testRSSParsing()
