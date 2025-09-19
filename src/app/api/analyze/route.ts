import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, items } = await request.json()
    
    // 检查是否有 OpenAI API Key
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      // 如果没有 API Key，返回默认分析
      return NextResponse.json({
        summary: `基于 ${items.length} 条内容的分析摘要。`,
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
        impact: '这些内容对相关技术领域的发展具有积极影响。',
        recommendations: [
          '持续关注相关技术发展',
          '参与社区讨论和贡献',
          '将新技术应用到实际项目中'
        ],
        keyEntities: items.map((item: any) => item.author).filter(Boolean).slice(0, 5)
      })
    }
    
    // 调用 OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的新闻分析师，擅长分析技术内容并提供深度洞察。请用中文回答，保持专业和客观。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    // 解析 AI 返回的分析结果
    const parsedAnalysis = parseAnalysisResponse(analysisText)
    
    return NextResponse.json(parsedAnalysis)
    
  } catch (error) {
    console.error('Analysis API error:', error)
    
    // 返回错误响应
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}

function parseAnalysisResponse(text: string) {
  // 简单的文本解析逻辑
  const lines = text.split('\n').filter(line => line.trim())
  
  const summary = lines.find(line => line.includes('摘要') || line.includes('总结')) || 
                  lines.slice(0, 3).join(' ')
  
  const insights = lines
    .filter(line => line.includes('-') || line.includes('•') || line.includes('*'))
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .slice(0, 5)
  
  const trends = lines
    .filter(line => line.toLowerCase().includes('趋势') || line.toLowerCase().includes('发展'))
    .slice(0, 3)
  
  const impact = lines.find(line => line.includes('影响') || line.includes('意义')) || 
                 '这些内容对相关领域具有重要影响。'
  
  const recommendations = lines
    .filter(line => line.includes('建议') || line.includes('推荐'))
    .slice(0, 3)
  
  const keyEntities = lines
    .filter(line => line.includes('实体') || line.includes('关键'))
    .slice(0, 5)
  
  return {
    summary: summary.substring(0, 200),
    insights: insights.length > 0 ? insights : ['内容更新活跃', '质量较高', '涉及多个领域'],
    trends: trends.length > 0 ? trends : ['技术发展加速', '社区活跃', '跨领域合作'],
    impact: impact.substring(0, 150),
    recommendations: recommendations.length > 0 ? recommendations : ['持续关注', '积极参与', '实践应用'],
    keyEntities: keyEntities.length > 0 ? keyEntities : ['技术社区', '开源项目', '开发者']
  }
}
