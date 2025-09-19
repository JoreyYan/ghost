"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TrendingUp, FileText, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AIService } from "@/lib/ai-service"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [sources, setSources] = useState<Array<{
    id: string
    name: string
    kind: string
    handle: string
    active: boolean
    created_at: string
  }>>([])
  const [recentItems, setRecentItems] = useState<Array<{
    id: string
    title: string
    content: string
    url: string
    published_at: string
    sources: {
      name: string
      kind: string
    }
  }>>([])
  const [dailyDigests, setDailyDigests] = useState<Array<{
    id: string
    summary_md: string
    created_at: string
    sources: {
      name: string
    }
  }>>([])
  const [stats, setStats] = useState({
    totalSources: 0,
    totalItems: 0,
    activeSources: 0,
    todayItems: 0
  })

  // 获取仪表板数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 获取数据源
        const { data: sourcesData } = await supabase
          .from('sources')
          .select('*')
          .order('created_at', { ascending: false })

        // 获取最近的项目
        const { data: itemsData } = await supabase
          .from('items')
          .select(`
            *,
            sources (
              name,
              kind
            )
          `)
          .order('published_at', { ascending: false })
          .limit(10)

        // 获取今日摘要
        const today = new Date().toISOString().split('T')[0]
        const { data: digestsData } = await supabase
          .from('daily_digests')
          .select(`
            *,
            sources (
              name
            )
          `)
          .eq('date', today)
          .order('created_at', { ascending: false })

        // 计算统计信息
        const totalItems = await supabase
          .from('items')
          .select('id', { count: 'exact' })

        const todayItems = await supabase
          .from('items')
          .select('id', { count: 'exact' })
          .gte('published_at', `${today}T00:00:00Z`)

        setSources(sourcesData || [])
        setRecentItems(itemsData || [])
        setDailyDigests(digestsData || [])
        setStats({
          totalSources: sourcesData?.length || 0,
          totalItems: totalItems.count || 0,
          activeSources: sourcesData?.filter(s => s.active).length || 0,
          todayItems: todayItems.count || 0
        })

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // 生成今日摘要
  const generateTodayDigest = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // 为每个活跃源生成摘要
      for (const source of sources.filter(s => s.active)) {
        await AIService.generateDailyDigest(source.id, today)
      }
      
      alert('今日摘要生成完成！')
      window.location.reload()
    } catch (error) {
      console.error('Error generating digest:', error)
      alert('生成摘要时发生错误')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Today&apos;s Highlights</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Today&apos;s Highlights</h1>
          <p className="text-muted-foreground">Overview of today&apos;s news intelligence</p>
        </div>
        <Button onClick={generateTodayDigest} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate Today&apos;s Digest
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSources}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSources} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayItems} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSources}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSources - stats.activeSources} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Items</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayItems}</div>
            <p className="text-xs text-muted-foreground">
              New content today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Items */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
            <CardDescription>Latest content from your sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items found. Add sources and fetch data to get started.</p>
              ) : (
                recentItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium leading-none">
                          {item.title || 'Untitled'}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {item.sources?.kind || 'unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.sources?.name || 'Unknown Source'}</span>
                        <span>•</span>
                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                        {item.url && (
                          <>
                            <span>•</span>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Digests */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Digests</CardTitle>
            <CardDescription>AI-generated summaries for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyDigests.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">No digests generated for today</p>
                  <Button size="sm" onClick={generateTodayDigest}>
                    Generate Digest
                  </Button>
                </div>
              ) : (
                dailyDigests.map((digest) => (
                  <div key={digest.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{digest.sources?.name || 'Unknown Source'}</h4>
                      <Badge variant="secondary">Today</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {digest.summary_md?.substring(0, 150)}...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Generated at {new Date(digest.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sources Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sources Overview</CardTitle>
          <CardDescription>Status of your data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sources configured. Add your first source to get started.</p>
            ) : (
              sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{source.name}</h4>
                      <Badge variant={source.active ? "default" : "secondary"}>
                        {source.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{source.kind}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{source.handle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${source.active ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm text-muted-foreground">
                      {source.active ? 'Healthy' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}