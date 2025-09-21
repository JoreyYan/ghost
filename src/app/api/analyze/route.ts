import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, userPrompt, prompt } = await request.json()
    
    // 检查是否有 OpenAI API Key
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAIKey: !!openaiApiKey,
      keyPrefix: openaiApiKey ? openaiApiKey.substring(0, 20) + '...' : 'NOT SET'
    })
    
    if (!openaiApiKey) {
      // 如果没有 API Key，返回错误信息
      return NextResponse.json(
        { 
          error: 'OpenAI API Key not configured',
          message: '请在 Vercel 环境变量中配置 OPENAI_API_KEY',
          details: '获取 API Key: https://platform.openai.com/api-keys',
          debug: {
            nodeEnv: process.env.NODE_ENV,
            allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
          }
        },
        { status: 400 }
      )
    }
    
    // 构建消息数组
    const messages = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    } else {
      // 默认系统提示词
      messages.push({ 
        role: 'system', 
        content: '你是一个专业的新闻分析师，擅长分析技术内容并提供深度洞察。请用中文回答，保持专业和客观。' 
      })
    }
    messages.push({ role: 'user', content: userPrompt || prompt })
    
    // 调用 OpenAI API（带重试机制）
    let response: Response | undefined
    let retryCount = 0
    const maxRetries = 2
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 1000,
            temperature: 0.7
          })
        })
        
        // 如果是 429 错误且还有重试次数，等待后重试
        if (response.status === 429 && retryCount < maxRetries) {
          const waitTime = Math.pow(2, retryCount) * 1000 // 指数退避
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${retryCount + 1}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          retryCount++
          continue
        }
        
        break // 成功或达到最大重试次数
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++
          const waitTime = Math.pow(2, retryCount) * 1000
          console.log(`Request failed, waiting ${waitTime}ms before retry ${retryCount}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
        throw error
      }
    }
    
    if (!response || !response.ok) {
      const errorData = response ? await response.text() : 'No response received'
      console.error('OpenAI API error:', {
        status: response?.status,
        statusText: response?.statusText,
        errorData,
        retryCount
      })
      
      // 为 429 错误提供更友好的信息
      if (response?.status === 429) {
        throw new Error(`OpenAI API 调用频率超限 (429) - 请稍后重试。这通常是因为短时间内发送了太多请求。`)
      }
      
      throw new Error(`OpenAI API error: ${response?.status || 'Unknown'} - ${response?.statusText || 'No response'}`)
    }
    
    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    // 解析 AI 返回的分析结果
    const parsedAnalysis = parseAnalysisResponse(analysisText)
    
    return NextResponse.json(parsedAnalysis)
    
  } catch (error) {
    console.error('Analysis API error:', error)
    
    // 返回详细的错误响应
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorType = error instanceof Error ? error.name : 'Error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        message: errorMessage,
        type: errorType,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
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
