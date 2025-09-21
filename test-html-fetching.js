const htmlUrl = 'https://github.com/Peldom/papers_for_protein_design_using_DL/blob/main/README.md'

async function testHTMLFetching() {
  try {
    console.log('Testing HTML fetching for:', htmlUrl)
    
    // 使用 CORS 代理
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(htmlUrl)}`
    console.log('Fetching via proxy:', proxyUrl)
    
    const response = await fetch(proxyUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.statusText}`)
    }
    
    const data = await response.json()
    let htmlContent = data.contents
    
    console.log('Raw content length:', htmlContent.length)
    console.log('Content starts with:', htmlContent.substring(0, 200))
    
    // 检查是否 base64 编码
    if (htmlContent.startsWith('data:text/html; charset=utf-8;base64,')) {
      console.log('Content is base64 encoded, decoding...')
      const base64Data = htmlContent.split(',')[1]
      htmlContent = Buffer.from(base64Data, 'base64').toString('utf-8')
      console.log('Decoded content length:', htmlContent.length)
    }
    
    // 查找最新论文部分
    const latestPapersMatch = htmlContent.match(/Papers last week, updated on ([^:]+):([\s\S]*?)(?=\n\n|\n###|\n##|$)/i)
    
    if (latestPapersMatch) {
      const updateDate = latestPapersMatch[1].trim()
      const papersContent = latestPapersMatch[2].trim()
      
      console.log('\n=== Found Latest Papers Section ===')
      console.log('Update Date:', updateDate)
      console.log('Papers Content Length:', papersContent.length)
      console.log('Papers Content Preview:', papersContent.substring(0, 500))
      
      // 解析每个论文条目
      const paperEntries = papersContent.split(/\n\s*\*\s*/).filter(entry => entry.trim())
      
      console.log('\n=== Parsed Paper Entries ===')
      console.log('Total entries:', paperEntries.length)
      
      paperEntries.forEach((entry, index) => {
        if (entry.trim()) {
          const lines = entry.split('\n').filter(line => line.trim())
          if (lines.length > 0) {
            const title = lines[0].trim()
            console.log(`\nPaper ${index + 1}:`)
            console.log('  Title:', title)
            
            // 提取链接
            const links = entry.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
            console.log('  Links:', links)
            
            console.log('  Full content:', entry.substring(0, 200) + '...')
          }
        }
      })
    } else {
      console.log('\n=== No Latest Papers Section Found ===')
      console.log('Looking for alternative patterns...')
      
      // 尝试其他模式
      const patterns = [
        /Papers last week[^:]*:([\s\S]*?)(?=\n\n|\n###|\n##|$)/i,
        /Latest papers[^:]*:([\s\S]*?)(?=\n\n|\n###|\n##|$)/i,
        /Recent papers[^:]*:([\s\S]*?)(?=\n\n|\n###|\n##|$)/i
      ]
      
      for (const pattern of patterns) {
        const match = htmlContent.match(pattern)
        if (match) {
          console.log('Found alternative pattern:', pattern.source)
          console.log('Content:', match[1].substring(0, 300))
          break
        }
      }
    }
    
  } catch (error) {
    console.error('HTML fetching test failed:', error)
  }
}

testHTMLFetching()
