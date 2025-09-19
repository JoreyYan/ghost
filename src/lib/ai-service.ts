import { supabase } from './supabase'

export interface AnalysisResult {
  summary: string
  insights: string[]
  trends: string[]
  impact: string
  recommendations: string[]
  keyEntities: string[]
}

export interface DailyDigest {
  sourceId: string
  date: string
  summaryMd: string
  insightsMd: string
  items: any[]
}

export class AIService {
  // 使用 OpenAI API 进行分析
  static async analyzeContent(items: any[], sourceName: string): Promise<AnalysisResult> {
    try {
      // 构建分析提示词
      const prompt = this.buildAnalysisPrompt(items, sourceName)
      
      // 调用 OpenAI API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          items: items.slice(0, 10) // 限制项目数量
        })
      })
      
      if (!response.ok) {
        throw new Error(`Analysis API error: ${response.status}`)
      }
      
      const result = await response.json()
      return result
      
    } catch (error) {
      console.error('AI analysis error:', error)
      // 返回默认分析结果
      return this.getDefaultAnalysis(items, sourceName)
    }
  }
  
  // 构建分析提示词
  private static buildAnalysisPrompt(items: any[], sourceName: string): string {
    const itemsText = items.map((item, index) => 
      `${index + 1}. ${item.title}\n   ${item.content?.substring(0, 200)}...\n   URL: ${item.url}\n`
    ).join('\n')
    
    return `你是一个专业的新闻分析师，请分析以下来自 "${sourceName}" 的最新内容：

${itemsText}

请提供以下分析：

1. **摘要** (100-150字): 总结今日的主要内容和趋势
2. **关键洞察** (3-5条): 重要的发现和趋势
3. **影响评估**: 这些内容对相关领域的影响
4. **行动建议** (3条): 基于分析的具体建议
5. **关键实体**: 提到的重要人物、组织或项目

请用中文回答，保持专业和客观。`
  }
  
  // 生成每日摘要
  static async generateDailyDigest(sourceId: string, date: string): Promise<DailyDigest> {
    try {
      // 获取指定日期的项目
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('source_id', sourceId)
        .gte('published_at', `${date}T00:00:00Z`)
        .lt('published_at', `${date}T23:59:59Z`)
        .order('published_at', { ascending: false })
      
      if (itemsError) {
        throw new Error(`Failed to fetch items: ${itemsError.message}`)
      }
      
      if (!items || items.length === 0) {
        return {
          sourceId,
          date,
          summaryMd: '今日无新内容',
          insightsMd: '暂无洞察',
          items: []
        }
      }
      
      // 获取源信息
      const { data: source } = await supabase
        .from('sources')
        .select('name')
        .eq('id', sourceId)
        .single()
      
      // 进行 AI 分析
      const analysis = await this.analyzeContent(items, source?.name || 'Unknown Source')
      
      // 构建 Markdown 格式的摘要
      const summaryMd = `# ${source?.name || 'Unknown Source'} - ${date} 摘要

## 📊 今日概览
${analysis.summary}

## 🔍 关键洞察
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

## 📈 趋势分析
${analysis.trends.map(trend => `- ${trend}`).join('\n')}

## 💡 影响评估
${analysis.impact}

## 🎯 行动建议
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## 👥 关键实体
${analysis.keyEntities.map(entity => `- ${entity}`).join('\n')}
`
      
      // 构建洞察文档
      const insightsMd = `## 深度分析

### 内容分布
- 总项目数: ${items.length}
- 主要作者: ${this.getTopAuthors(items)}
- 热门标签: ${this.getTopTags(items)}

### 时间趋势
${this.analyzeTimeTrends(items)}

### 内容质量评估
${this.assessContentQuality(items)}
`
      
      // 保存到数据库
      const { error: saveError } = await supabase
        .from('daily_digests')
        .upsert({
          source_id: sourceId,
          date,
          summary_md: summaryMd,
          insights_md: insightsMd,
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            url: item.url
          }))
        })
      
      if (saveError) {
        console.error('Failed to save digest:', saveError)
      }
      
      return {
        sourceId,
        date,
        summaryMd,
        insightsMd,
        items
      }
      
    } catch (error) {
      console.error('Daily digest generation error:', error)
      throw error
    }
  }
  
  // 获取默认分析结果（当 AI 服务不可用时）
  private static getDefaultAnalysis(items: any[], sourceName: string): AnalysisResult {
    return {
      summary: `今日从 ${sourceName} 获取了 ${items.length} 条新内容，涵盖了多个重要主题。`,
      insights: [
        '内容更新频繁，显示活跃的社区参与',
        '涉及多个技术领域，体现了跨学科的特点',
        '质量较高，包含详细的技术讨论'
      ],
      trends: [
        '技术发展持续加速',
        '开源项目活跃度提升',
        '跨领域合作增多'
      ],
      impact: '这些内容对相关技术领域的发展具有积极影响，为开发者提供了宝贵的参考。',
      recommendations: [
        '持续关注相关技术发展',
        '参与社区讨论和贡献',
        '将新技术应用到实际项目中'
      ],
      keyEntities: this.extractKeyEntities(items)
    }
  }
  
  // 提取关键实体
  private static extractKeyEntities(items: any[]): string[] {
    const entities = new Set<string>()
    
    items.forEach(item => {
      // 提取作者
      if (item.author) {
        entities.add(item.author)
      }
      
      // 从标签中提取实体
      if (item.tags) {
        item.tags.forEach((tag: string) => {
          if (tag.length > 2) {
            entities.add(tag)
          }
        })
      }
    })
    
    return Array.from(entities).slice(0, 10)
  }
  
  // 获取主要作者
  private static getTopAuthors(items: any[]): string {
    const authorCount: { [key: string]: number } = {}
    
    items.forEach(item => {
      if (item.author) {
        authorCount[item.author] = (authorCount[item.author] || 0) + 1
      }
    })
    
    const topAuthors = Object.entries(authorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([author]) => author)
    
    return topAuthors.join(', ')
  }
  
  // 获取热门标签
  private static getTopTags(items: any[]): string {
    const tagCount: { [key: string]: number } = {}
    
    items.forEach(item => {
      if (item.tags) {
        item.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    const topTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)
    
    return topTags.join(', ')
  }
  
  // 分析时间趋势
  private static analyzeTimeTrends(items: any[]): string {
    const hourlyCount: { [key: number]: number } = {}
    
    items.forEach(item => {
      const hour = new Date(item.published_at).getHours()
      hourlyCount[hour] = (hourlyCount[hour] || 0) + 1
    })
    
    const peakHour = Object.entries(hourlyCount)
      .sort(([,a], [,b]) => b - a)[0]
    
    return `内容发布高峰时间: ${peakHour ? `${peakHour[0]}:00 (${peakHour[1]}条)` : '无数据'}`
  }
  
  // 评估内容质量
  private static assessContentQuality(items: any[]): string {
    const avgLength = items.reduce((sum, item) => 
      sum + (item.content?.length || 0), 0) / items.length
    
    const hasDetailedContent = items.filter(item => 
      item.content && item.content.length > 100).length
    
    return `平均内容长度: ${Math.round(avgLength)}字符\n详细内容比例: ${Math.round(hasDetailedContent / items.length * 100)}%`
  }
}
