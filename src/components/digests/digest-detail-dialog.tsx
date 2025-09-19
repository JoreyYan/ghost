"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  X, 
  Share2, 
  Download, 
  ExternalLink, 
  Calendar,
  Clock,
  FileText,
  Zap,
  Target,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface DigestDetailDialogProps {
  digestId: string
  onClose: () => void
}

// Mock data for digest details
const mockDigestDetail = {
  id: "1",
  date: "2025-01-19",
  category: "金融类",
  summary: "今日金融类新闻重点关注加密货币市场突破和央行政策调整，市场情绪整体乐观。比特币价格突破$50,000大关，创下近期新高。同时，央行数字货币试点范围进一步扩大，多家银行宣布参与数字人民币测试。金融科技领域也迎来新的发展机遇，多家AI金融公司获得新一轮融资。",
  insights: [
    {
      id: "1",
      type: "trend",
      title: "加密货币市场情绪乐观",
      content: "比特币突破关键阻力位，机构投资者增持明显，市场对加密货币的接受度持续提升。",
      impact: "high"
    },
    {
      id: "2", 
      type: "policy",
      title: "央行数字货币试点扩大",
      content: "数字人民币试点范围从一线城市扩展到更多地区，为数字货币的全面推广奠定基础。",
      impact: "medium"
    },
    {
      id: "3",
      type: "investment",
      title: "金融科技融资活跃",
      content: "AI+金融领域获得多笔大额融资，显示投资者对金融科技创新的信心。",
      impact: "high"
    },
    {
      id: "4",
      type: "regulation",
      title: "监管政策趋于明朗",
      content: "相关监管部门发布新的指导意见，为金融科技创新提供更清晰的发展方向。",
      impact: "medium"
    }
  ],
  actions: [
    {
      id: "1",
      title: "关注比特币ETF资金流入趋势",
      description: "监控机构投资者对比特币ETF的配置情况，分析市场资金流向变化。",
      priority: "high",
      category: "market_analysis"
    },
    {
      id: "2",
      title: "研究央行数字货币试点进展",
      description: "深入了解数字人民币在不同场景下的应用效果，评估对传统支付体系的影响。",
      priority: "medium",
      category: "policy_research"
    },
    {
      id: "3",
      title: "评估金融科技AI应用投资机会",
      description: "分析AI在金融领域的应用前景，识别具有投资价值的创新公司。",
      priority: "high",
      category: "investment_analysis"
    }
  ],
  citations: [
    {
      id: "1",
      title: "Bitcoin突破新高 - CoinDesk",
      url: "https://coindesk.com/bitcoin-breaks-50000",
      publishedAt: "2025-01-19 08:00:00",
      source: "CoinDesk"
    },
    {
      id: "2",
      title: "央行数字货币试点扩大 - 央行官网",
      url: "https://pbc.gov.cn/digital-yuan-expansion",
      publishedAt: "2025-01-19 09:30:00",
      source: "央行官网"
    },
    {
      id: "3",
      title: "AI金融科技公司获5000万美元融资 - TechCrunch",
      url: "https://techcrunch.com/ai-fintech-funding",
      publishedAt: "2025-01-19 10:15:00",
      source: "TechCrunch"
    }
  ],
  metadata: {
    generatedAt: "2025-01-19 08:30:00",
    policy: "Finance Policy v1.0",
    sourceCount: 3,
    newItems: 8,
    processingTime: "2.3s"
  }
}

export function DigestDetailDialog({ digestId: _digestId, onClose }: DigestDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium Impact</Badge>
      case "low":
        return <Badge variant="outline">Low Impact</Badge>
      default:
        return <Badge variant="outline">{impact}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "policy":
        return <FileText className="h-4 w-4 text-green-500" />
      case "investment":
        return <Target className="h-4 w-4 text-purple-500" />
      case "regulation":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-[800px] bg-background border-l shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {mockDigestDetail.date} - {mockDigestDetail.category}
              </h2>
              <p className="text-sm text-muted-foreground">
                Generated at {mockDigestDetail.metadata.generatedAt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Sources</span>
                </div>
                <div className="text-2xl font-bold">{mockDigestDetail.metadata.sourceCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">New Items</span>
                </div>
                <div className="text-2xl font-bold">{mockDigestDetail.metadata.newItems}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Insights</span>
                </div>
                <div className="text-2xl font-bold">{mockDigestDetail.insights.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Processing</span>
                </div>
                <div className="text-sm font-bold">{mockDigestDetail.metadata.processingTime}</div>
              </CardContent>
            </Card>
          </div>

          {/* Policy Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Analysis Policy:</span>
                  <Badge variant="outline" className="ml-2">{mockDigestDetail.metadata.policy}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  View Policy Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{mockDigestDetail.summary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {mockDigestDetail.insights.map((insight) => (
                  <Card key={insight.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getInsightIcon(insight.type)}
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                        {getImpactBadge(insight.impact)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{insight.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="space-y-4">
                {mockDigestDetail.actions.map((action) => (
                  <Card key={action.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        {getPriorityBadge(action.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{action.category}</Badge>
                        <Button variant="outline" size="sm">
                          <Target className="mr-1 h-3 w-3" />
                          Add to Tasks
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="citations" className="space-y-4">
              <div className="space-y-3">
                {mockDigestDetail.citations.map((citation, index) => (
                  <Card key={citation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">[{index + 1}]</Badge>
                            <span className="font-medium text-sm">{citation.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {citation.source} • {citation.publishedAt}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              <LinkIcon className="mr-1 h-3 w-3" />
                              View Original
                            </Button>
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Open Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous Digest
            </Button>
            <Button variant="outline" size="sm">
              Next Digest
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


