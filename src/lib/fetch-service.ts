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
  // 从 GitHub 仓库获取最新信息
  static async fetchGitHubRepo(repoUrl: string): Promise<FetchResult> {
    try {
      // 解析 GitHub URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) {
        throw new Error('Invalid GitHub repository URL')
      }
      
      const [, owner, repo] = match
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'NewsIntelligence/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      const repoData: GitHubRepoData = await response.json()
      
      // 获取最近的 commits
      const commitsResponse = await fetch(`${apiUrl}/commits?per_page=10`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'NewsIntelligence/1.0'
        }
      })
      
      const commits = commitsResponse.ok ? await commitsResponse.json() as Array<{
        html_url: string
        sha: string
        commit: {
          message: string
          author: {
            name: string
            date: string
          }
        }
      }> : []
      
      // 获取最近的 releases
      const releasesResponse = await fetch(`${apiUrl}/releases?per_page=5`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'NewsIntelligence/1.0'
        }
      })
      
      const releases = releasesResponse.ok ? await releasesResponse.json() as Array<{
        html_url: string
        name: string
        tag_name: string
        body: string
        published_at: string
        author: {
          login: string
        }
      }> : []
      
      // 构建项目数据
      const items: Array<{
        url: string
        title: string
        author: string
        published_at: string
        content: string
        tags: string[]
        metadata: Record<string, unknown>
      }> = [
        {
          url: repoData.html_url,
          title: `Repository Update: ${repoData.name}`,
          author: owner,
          published_at: repoData.updated_at,
          content: repoData.description || 'No description available',
          tags: repoData.topics || [],
          metadata: {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            language: repoData.language,
            type: 'repository_info'
          }
        }
      ]
      
      // 添加最近的 commits
      commits.forEach((commit) => {
        items.push({
          url: commit.html_url,
          title: `Commit: ${commit.commit.message.split('\n')[0]}`,
          author: commit.commit.author.name,
          published_at: commit.commit.author.date,
          content: commit.commit.message,
          tags: ['commit'],
          metadata: {
            sha: commit.sha,
            type: 'commit'
          }
        })
      })
      
      // 添加最近的 releases
      releases.forEach((release) => {
        items.push({
          url: release.html_url,
          title: `Release: ${release.name || release.tag_name}`,
          author: release.author?.login || 'Unknown',
          published_at: release.published_at,
          content: release.body || 'No release notes',
          tags: ['release'],
          metadata: {
            tag_name: release.tag_name,
            type: 'release'
          }
        })
      })
      
      return {
        success: true,
        newItems: items.length,
        items
      }
      
    } catch (error) {
      console.error('GitHub fetch error:', error)
      return {
        success: false,
        newItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 从 RSS 源获取数据
  static async fetchRSSFeed(_rssUrl: string): Promise<FetchResult> {
    try {
      // 这里需要后端服务来解析 RSS，因为浏览器有 CORS 限制
      // 暂时返回模拟数据
      return {
        success: true,
        newItems: 3,
        items: [
          {
            url: 'https://example.com/article1',
            title: 'Latest Research Paper',
            author: 'Dr. Smith',
            published_at: new Date().toISOString(),
            content: 'Abstract of the latest research...',
            tags: ['research', 'ai'],
            metadata: {
              type: 'rss_item',
              source: 'rss_feed'
            }
          }
        ]
      }
    } catch (error) {
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
          fetchResult = await this.fetchGitHubRepo(source.handle)
          break
        case 'rss':
          fetchResult = await this.fetchRSSFeed(source.handle)
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
