import { supabase } from './supabase'

export interface FetchResult {
  success: boolean
  newItems: number
  error?: string
  items?: Array<{
    url: string
    title: string
    author: string
    published_at: string
    content: string
    tags: string[]
    metadata: Record<string, unknown>
  }>
}

export interface GitHubRepoData {
  name: string
  description: string
  html_url: string
  updated_at: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
}

export class FetchService {
  // 从 GitHub 仓库获取 README 内容（简化版本）
  static async fetchGitHubRepo(repoUrl: string, sourceConfig?: {
    extract_section?: string;
    dedup_strategy?: string;
    ai_focus?: string;
    id?: string;
  }): Promise<FetchResult> {
    try {
      // 解析 GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) {
        throw new Error('Invalid GitHub repository URL')
      }
      
      const [, owner, repo] = match
      
      // 使用 GitHub API 获取 README 原始内容
      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`
      console.log('Fetching README from GitHub API:', githubApiUrl)
      
      const response = await fetch(githubApiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'News-Intelligence-System'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // 解码 base64 内容
      const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8')
      console.log('README content length:', readmeContent.length)
      
      // 如果配置了提取特定章节，只提取该章节内容
      let contentToAnalyze = readmeContent
      let sectionContent = ''
      
      if (sourceConfig?.extract_section) {
        console.log('Extracting section:', sourceConfig.extract_section)
        const lines = readmeContent.split('\n')
        let inSection = false
        const sectionLines: string[] = []
        
        for (const line of lines) {
          if (line.includes(sourceConfig.extract_section)) {
            inSection = true
            sectionLines.push(line)
            continue
          }
          
          if (inSection) {
            // 如果遇到另一个主要章节标记，停止提取
            if (line.match(/^#{1,2}\s/) && !line.includes(sourceConfig.extract_section)) {
              break
            }
            sectionLines.push(line)
          }
        }
        
        sectionContent = sectionLines.join('\n').trim()
        console.log('Extracted section content length:', sectionContent.length)
        
        if (sectionContent) {
          contentToAnalyze = sectionContent
          
          // 检查去重策略
          if (sourceConfig?.dedup_strategy === 'section_hash' && sourceConfig?.id) {
            // 计算章节内容哈希
            const crypto = require('crypto')
            const contentHash = crypto.createHash('md5').update(sectionContent).digest('hex')
            console.log('Section content hash:', contentHash)
            
            // 检查是否已经抓取过相同内容
            const { data: existingItems } = await supabase
              .from('items')
              .select('metadata')
              .eq('source_id', sourceConfig.id)
              .order('created_at', { ascending: false })
              .limit(1)
            
            if (existingItems && existingItems.length > 0) {
              const lastHash = existingItems[0]?.metadata?.section_hash
              if (lastHash === contentHash) {
                console.log('Section content unchanged, skipping...')
                return {
                  success: true,
                  newItems: 0,
                  items: []
                }
              }
            }
          }
        } else {
          console.log('Section not found, will analyze full content')
        }
      }
      
      // 立即进行 AI 分析，生成 50 字简洁总结
      let aiSummary = ''
      try {
        console.log('Generating concise AI summary for README...')
        const { AIService } = await import('./ai-service')
        
        const analysisResult = await AIService.analyzeContent([{
          title: `${owner}/${repo} - README 更新`,
          content: contentToAnalyze,
          url: repoUrl,
          published_at: new Date().toISOString(),
          author: owner
        }], `${owner}/${repo}`, sourceConfig?.ai_focus || '这是一个蛋白质设计论文集合的 GitHub README，请重点关注最新添加的论文、研究方法、技术突破、作者信息等')
        
        // 生成 50 字简洁总结
        if (analysisResult.summary) {
          aiSummary = analysisResult.summary.substring(0, 50) + '...'
        } else if (analysisResult.insights && analysisResult.insights.length > 0) {
          aiSummary = analysisResult.insights[0].substring(0, 50) + '...'
        } else {
          // 提取 README 中的关键信息
          const lines = readmeContent.split('\n')
          const latestPapersLine = lines.find(line => line.includes('Papers last week'))
          if (latestPapersLine) {
            aiSummary = latestPapersLine.substring(0, 50) + '...'
          } else {
            aiSummary = `${owner}/${repo} 仓库更新，包含蛋白质设计相关的最新论文和研究进展...`
          }
        }
        
        console.log('Concise AI summary generated:', aiSummary)
      } catch (error) {
        console.error('AI analysis failed, using fallback:', error)
        // 如果 AI 分析失败，使用简单的文本提取
        const lines = readmeContent.split('\n')
        const latestPapersLine = lines.find(line => line.includes('Papers last week'))
        if (latestPapersLine) {
          aiSummary = latestPapersLine.substring(0, 50) + '...'
        } else {
          aiSummary = `${owner}/${repo} 仓库更新，包含蛋白质设计相关的最新论文和研究进展...`
        }
      }
      
      // 创建单个条目，包含简洁的 AI 总结
      const items: Array<{
        url: string
        title: string
        author: string
        published_at: string
        content: string
        tags: string[]
        metadata: Record<string, unknown>
      }> = []
      
      // 计算内容哈希用于去重
      const crypto = require('crypto')
      const contentHash = crypto.createHash('md5').update(sectionContent || contentToAnalyze).digest('hex')
      
      items.push({
        url: repoUrl,
        title: `${owner}/${repo} - 最新更新`,
        author: owner,
        published_at: new Date().toISOString(),
        content: aiSummary,
        tags: ['github', 'readme', 'protein-design', 'deep-learning', 'ai-summary'],
        metadata: {
          type: 'github_readme_summary',
          source: 'github_api',
          owner: owner,
          repo: repo,
          sha: data.sha,
          size: data.size,
          originalUrl: repoUrl,
          section_hash: contentHash,
          extracted_section: sourceConfig?.extract_section || null
        }
      })

      
      return {
        success: true,
        newItems: items.length,
        items
      }
      
    } catch (error) {
      console.error('GitHub README fetch error:', error)
      return {
        success: false,
        newItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 从 RSS 源获取数据
  static async fetchRSSFeed(rssUrl: string, sourceId?: string): Promise<FetchResult> {
    try {
      // 使用代理服务来避免 CORS 问题
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`
      
      const response = await fetch(proxyUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS: ${response.statusText}`)
      }
      
      const data = await response.json()
      let rssContent = data.contents
      
      // 检查是否是 base64 编码的内容
      if (rssContent.startsWith('data:application/atom+xml; charset=utf-8;base64,')) {
        const base64Data = rssContent.split(',')[1]
        rssContent = Buffer.from(base64Data, 'base64').toString('utf-8')
      }
      
      // 简单的 XML 解析
      const items: Array<{
        url: string
        title: string
        author: string
        published_at: string
        content: string
        tags: string[]
        metadata: Record<string, unknown>
      }> = []
      
      // 解析 RSS/Atom feed
      const entryMatches = rssContent.match(/<entry[^>]*>[\s\S]*?<\/entry>/g) || 
                          rssContent.match(/<item[^>]*>[\s\S]*?<\/item>/g) || []
      
      for (const entry of entryMatches) {
        const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/i)
        const linkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*>/i) || 
                         entry.match(/<link[^>]*>([^<]*)<\/link>/i)
        const authorMatch = entry.match(/<author[^>]*>[\s\S]*?<name[^>]*>([^<]*)<\/name>[\s\S]*?<\/author>/i) ||
                           entry.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/i)
        const dateMatch = entry.match(/<updated[^>]*>([^<]*)<\/updated>/i) ||
                         entry.match(/<pubDate[^>]*>([^<]*)<\/pubDate>/i)
        const contentMatch = entry.match(/<content[^>]*>([^<]*)<\/content>/i) ||
                            entry.match(/<description[^>]*>([^<]*)<\/description>/i)
        
        if (titleMatch && linkMatch) {
          // 解码 HTML 实体
          const decodeHtml = (html: string) => {
            return html
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/<[^>]*>/g, '') // 移除 HTML 标签
              .trim()
          }
          
          const title = decodeHtml(titleMatch[1])
          const content = contentMatch ? decodeHtml(contentMatch[1]) : title
          
          // 对于 GitHub commits，尝试获取更详细的信息
          let enhancedContent = content
          if (content === 'weekly updates' || content === title) {
            enhancedContent = `GitHub commit: ${title}\n\nThis appears to be a regular update commit. The actual changes may contain new papers or research updates.`
          }
          
          items.push({
            url: linkMatch[1],
            title: title,
            author: authorMatch ? authorMatch[1].trim() : 'Unknown',
            published_at: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
            content: enhancedContent,
            tags: ['commit', 'github'],
            metadata: {
              type: 'rss_item',
              source: 'github_commits_rss',
              originalContent: contentMatch ? contentMatch[1] : null
            }
          })
        }
      }
      
      // 保存到数据库
      const { data: existingItems, error: fetchError } = await supabase
        .from('items')
        .select('url')
        .in('url', items.map(item => item.url))

      if (fetchError) throw fetchError

      const existingUrls = new Set(existingItems?.map(item => item.url))
      const newItems = items.filter(item => !existingUrls.has(item.url))

      if (newItems.length > 0) {
        const { error: insertError } = await supabase
          .from('items')
          .insert(newItems.map(item => ({
            source_id: sourceId || 'unknown-source',
            url: item.url,
            title: item.title,
            author: item.author,
            published_at: item.published_at,
            content: item.content,
            tags: item.tags,
            raw_ref: JSON.stringify(item.metadata),
            content_sha: item.url
          })))
        if (insertError) throw insertError
      }

      return {
        success: true,
        newItems: newItems.length,
        items: newItems
      }
    } catch (error) {
      console.error('RSS fetch error:', error)
      return {
        success: false,
        newItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 从 GitHub README 获取数据（简化版本）
  static async fetchHTMLContent(htmlUrl: string, sourceId?: string): Promise<FetchResult> {
    try {
      console.log('Fetching GitHub README content from:', htmlUrl)
      
      // 专门处理 GitHub README
      if (htmlUrl.includes('github.com') && htmlUrl.includes('README.md')) {
        // 提取仓库信息
        const repoMatch = htmlUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (!repoMatch) {
          throw new Error('Invalid GitHub URL format')
        }
        
        const [, owner, repo] = repoMatch
        
        // 使用 GitHub API 获取 README 原始内容
        const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`
        console.log('Fetching from GitHub API:', githubApiUrl)
        
        const response = await fetch(githubApiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'News-Intelligence-System'
          }
        })
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // 解码 base64 内容
        const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8')
        console.log('README content length:', readmeContent.length)
        
        // 立即进行 AI 分析，生成更新总结
        let aiSummary = ''
        try {
          console.log('Generating AI summary for README...')
          const { AIService } = await import('./ai-service')
          
          const analysisResult = await AIService.analyzeContent([{
            title: `${owner}/${repo} - README 更新`,
            content: readmeContent,
            url: htmlUrl,
            published_at: new Date().toISOString(),
            author: owner
          }], `${owner}/${repo}`, '这是一个蛋白质设计论文集合的 GitHub README，请重点关注最新添加的论文、研究方法、技术突破、作者信息等')
          
          // 生成简洁的更新总结
          aiSummary = `📚 **${owner}/${repo} 最新更新**\n\n`
          
          if (analysisResult.summary) {
            aiSummary += `**更新概览：**\n${analysisResult.summary}\n\n`
          }
          
          if (analysisResult.insights && analysisResult.insights.length > 0) {
            aiSummary += `**重要发现：**\n`
            analysisResult.insights.slice(0, 3).forEach((insight: string, index: number) => {
              aiSummary += `${index + 1}. ${insight}\n`
            })
            aiSummary += '\n'
          }
          
          if (analysisResult.keyEntities && analysisResult.keyEntities.length > 0) {
            aiSummary += `**关键论文：**\n`
            analysisResult.keyEntities.slice(0, 5).forEach((entity: string) => {
              aiSummary += `• ${entity}\n`
            })
          }
          
          console.log('AI summary generated successfully')
        } catch (error) {
          console.error('AI analysis failed, using fallback:', error)
          // 如果 AI 分析失败，使用简单的文本提取
          const lines = readmeContent.split('\n')
          const latestPapersLine = lines.find(line => line.includes('Papers last week'))
          if (latestPapersLine) {
            aiSummary = `📚 **${owner}/${repo} 最新更新**\n\n${latestPapersLine}\n\n检测到最新论文更新，请查看完整摘要获取详细信息。`
          } else {
            aiSummary = `📚 **${owner}/${repo} README 更新**\n\n检测到 README 内容更新，包含蛋白质设计相关的最新论文和研究进展。`
          }
        }
        
        // 创建单个条目，包含 AI 分析后的内容
        const items: Array<{
          url: string
          title: string
          author: string
          published_at: string
          content: string
          tags: string[]
          metadata: Record<string, unknown>
        }> = []
        
        items.push({
          url: htmlUrl,
          title: `${owner}/${repo} - 最新更新`,
          author: owner,
          published_at: new Date().toISOString(),
          content: aiSummary,
          tags: ['github', 'readme', 'protein-design', 'deep-learning', 'ai-summary'],
          metadata: {
            type: 'github_readme_ai_summary',
            source: 'github_api',
            owner: owner,
            repo: repo,
            sha: data.sha,
            size: data.size,
            originalUrl: htmlUrl,
            originalContent: readmeContent.substring(0, 500) // 保存部分原始内容用于调试
          }
        })
        
        // 保存到数据库
        const { data: existingItems, error: fetchError } = await supabase
          .from('items')
          .select('url')
          .in('url', items.map(item => item.url))

        if (fetchError) throw fetchError

        const existingUrls = new Set(existingItems?.map(item => item.url))
        const newItems = items.filter(item => !existingUrls.has(item.url))

        if (newItems.length > 0) {
          const { error: insertError } = await supabase
            .from('items')
            .insert(newItems.map(item => ({
              source_id: sourceId || 'unknown-source',
              url: item.url,
              title: item.title,
              author: item.author,
              published_at: item.published_at,
              content: item.content,
              tags: item.tags,
              raw_ref: JSON.stringify(item.metadata),
              content_sha: item.url
            })))
          if (insertError) throw insertError
        }

        return {
          success: true,
          newItems: newItems.length,
          items: newItems
        }
      } else {
        // 处理其他 HTML 内容（保持原有逻辑）
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(htmlUrl)}`
        
        const response = await fetch(proxyUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch HTML: ${response.statusText}`)
        }
        
        const data = await response.json()
        let htmlContent = data.contents
        
        // 检查是否是 base64 编码的内容
        if (htmlContent.startsWith('data:text/html; charset=utf-8;base64,')) {
          const base64Data = htmlContent.split(',')[1]
          htmlContent = Buffer.from(base64Data, 'base64').toString('utf-8')
        }
        
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]*)<\/title>/i)
        const contentMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        
        const items = [{
          url: htmlUrl,
          title: titleMatch ? titleMatch[1].trim() : 'HTML Content',
          author: 'Unknown',
          published_at: new Date().toISOString(),
          content: contentMatch ? contentMatch[1].replace(/<[^>]*>/g, ' ').trim().substring(0, 1000) : 'HTML content',
          tags: ['html'],
          metadata: {
            type: 'html_content',
            source: 'html_fetch',
            originalUrl: htmlUrl
          }
        }]
        
        // 保存到数据库
        const { data: existingItems, error: fetchError } = await supabase
          .from('items')
          .select('url')
          .in('url', items.map(item => item.url))

        if (fetchError) throw fetchError

        const existingUrls = new Set(existingItems?.map(item => item.url))
        const newItems = items.filter(item => !existingUrls.has(item.url))

        if (newItems.length > 0) {
          const { error: insertError } = await supabase
            .from('items')
            .insert(newItems.map(item => ({
              source_id: sourceId || 'unknown-source',
              url: item.url,
              title: item.title,
              author: item.author,
              published_at: item.published_at,
              content: item.content,
              tags: item.tags,
              raw_ref: JSON.stringify(item.metadata),
              content_sha: item.url
            })))
          if (insertError) throw insertError
        }

        return {
          success: true,
          newItems: newItems.length,
          items: newItems
        }
      }
      
    } catch (error) {
      console.error('GitHub README fetch error:', error)
      return {
        success: false,
        newItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 执行数据抓取并保存到数据库
  static async fetchAndSave(sourceId: string): Promise<FetchResult> {
    try {
      // 获取源信息
      const { data: source, error: sourceError } = await supabase
        .from('sources')
        .select('*')
        .eq('id', sourceId)
        .single()
      
      if (sourceError || !source) {
        throw new Error('Source not found')
      }
      
      // 记录抓取开始
      const { data: fetchRun } = await supabase
        .from('fetch_runs')
        .insert({
          source_id: sourceId,
          started_at: new Date().toISOString(),
          ok: false
        })
        .select()
        .single()
      
      let fetchResult: FetchResult
      
      // 根据源类型选择抓取方法
      switch (source.kind) {
        case 'github_repo':
          fetchResult = await this.fetchGitHubRepo(source.handle, {
            extract_section: source.extract_section,
            dedup_strategy: source.dedup_strategy,
            ai_focus: source.ai_focus,
            id: sourceId
          })
          break
        case 'rss':
          fetchResult = await this.fetchRSSFeed(source.handle, sourceId)
          break
        case 'html':
          fetchResult = await this.fetchHTMLContent(source.handle, sourceId)
          break
        default:
          throw new Error(`Unsupported source type: ${source.kind}`)
      }
      
      if (!fetchResult.success) {
        // 更新抓取记录为失败
        await supabase
          .from('fetch_runs')
          .update({
            ended_at: new Date().toISOString(),
            ok: false,
            error: fetchResult.error
          })
          .eq('id', fetchRun.id)
        
        return fetchResult
      }
      
      // 保存抓取到的项目到数据库
      let savedCount = 0
      if (fetchResult.items) {
        for (const item of fetchResult.items) {
          // 检查是否已存在（基于 URL）
          const { data: existing } = await supabase
            .from('items')
            .select('id')
            .eq('source_id', sourceId)
            .eq('url', item.url)
            .single()
          
          if (!existing) {
            // 计算内容哈希用于去重
            const contentSha = await this.calculateSHA(item.url + item.title + item.content)
            
            const { error: insertError } = await supabase
              .from('items')
              .insert({
                source_id: sourceId,
                url: item.url,
                title: item.title,
                author: item.author,
                published_at: item.published_at,
                content: item.content,
                content_sha: contentSha,
                tags: item.tags || []
              })
            
            if (!insertError) {
              savedCount++
            }
          }
        }
      }
      
      // 更新抓取记录为成功
      await supabase
        .from('fetch_runs')
        .update({
          ended_at: new Date().toISOString(),
          ok: true,
          new_items: savedCount
        })
        .eq('id', fetchRun.id)
      
      return {
        success: true,
        newItems: savedCount
      }
      
    } catch (error) {
      console.error('Fetch and save error:', error)
      return {
        success: false,
        newItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 计算 SHA256 哈希
  private static async calculateSHA(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}
