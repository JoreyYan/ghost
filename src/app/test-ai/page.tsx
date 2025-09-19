"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Brain, TestTube, CheckCircle, XCircle } from "lucide-react"

export default function TestAIPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    summary: string
    insights: string[]
    trends: string[]
    impact: string
    recommendations: string[]
    keyEntities: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [testContent, setTestContent] = useState(`1. New protein folding model achieves 95% accuracy
2. Machine learning breakthrough in drug discovery
3. Open source AI framework released with 10k+ stars`)

  const testAI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `你是一个专业的新闻分析师，请分析以下来自 "Test Source" 的最新内容：

${testContent}

请提供以下分析：

1. **摘要** (100-150字): 总结今日的主要内容和趋势
2. **关键洞察** (3-5条): 重要的发现和趋势
3. **影响评估**: 这些内容对相关领域的影响
4. **行动建议** (3条): 基于分析的具体建议
5. **关键实体**: 提到的重要人物、组织或项目

请用中文回答，保持专业和客观。`,
          items: [
            {
              title: "Test Item 1",
              content: "New protein folding model achieves 95% accuracy",
              url: "https://example.com/1",
              author: "Dr. Smith",
              published_at: new Date().toISOString()
            },
            {
              title: "Test Item 2", 
              content: "Machine learning breakthrough in drug discovery",
              url: "https://example.com/2",
              author: "Dr. Johnson",
              published_at: new Date().toISOString()
            }
          ]
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI 分析功能测试
          </CardTitle>
          <CardDescription>
            测试 OpenAI API 集成和内容分析功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 测试内容输入 */}
          <div className="space-y-2">
            <Label htmlFor="test-content">测试内容</Label>
            <Textarea
              id="test-content"
              placeholder="输入要分析的内容..."
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              rows={6}
            />
          </div>

          {/* 测试按钮 */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={testAI} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  分析中...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  测试 AI 分析
                </>
              )}
            </Button>

            {result && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                AI 分析成功
              </Badge>
            )}

            {error && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                分析失败
              </Badge>
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800">错误信息:</h4>
              <p className="text-red-700 mt-1">{error}</p>
              <div className="mt-2 text-sm text-red-600">
                <p>可能的原因:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>未配置 OPENAI_API_KEY 环境变量</li>
                  <li>API Key 无效或过期</li>
                  <li>网络连接问题</li>
                  <li>OpenAI API 服务暂时不可用</li>
                </ul>
              </div>
            </div>
          )}

          {/* 分析结果 */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI 分析结果</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">摘要</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.summary}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">影响评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.impact}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">关键洞察</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.insights?.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">行动建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">关键实体</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.keyEntities?.map((entity: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {entity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 配置说明 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800">配置说明</h4>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>1. 在 Vercel 项目设置中添加环境变量: <code className="bg-blue-100 px-1 rounded">OPENAI_API_KEY</code></p>
              <p>2. 获取 OpenAI API Key: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">https://platform.openai.com/api-keys</a></p>
              <p>3. 重新部署项目使环境变量生效</p>
              <p>4. 测试 AI 分析功能</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
