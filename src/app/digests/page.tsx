"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Filter, Eye, Share2, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DigestDetailDialog } from "@/components/digests/digest-detail-dialog"

// Mock data for digests
const mockDigests = [
  {
    id: "1",
    date: "2025-01-19",
    category: "金融类",
    sourceCount: 3,
    newItems: 8,
    insights: 4,
    actions: 3,
    summary: "今日金融类新闻重点关注加密货币市场突破和央行政策调整，市场情绪整体乐观。",
    status: "completed",
    generatedAt: "2025-01-19 08:30:00",
    policy: "Finance Policy v1.0"
  },
  {
    id: "2",
    date: "2025-01-19",
    category: "生物AI",
    sourceCount: 2,
    newItems: 5,
    insights: 3,
    actions: 2,
    summary: "生物AI领域今日发布多篇重要论文，涉及蛋白质结构预测和基因组分析的新突破。",
    status: "completed",
    generatedAt: "2025-01-19 09:15:00",
    policy: "BioAI Policy v2.1"
  },
  {
    id: "3",
    date: "2025-01-18",
    category: "金融类",
    sourceCount: 3,
    newItems: 6,
    insights: 3,
    actions: 2,
    summary: "昨日金融类新闻主要关注传统银行业务数字化转型和金融科技监管政策。",
    status: "completed",
    generatedAt: "2025-01-18 08:30:00",
    policy: "Finance Policy v1.0"
  },
  {
    id: "4",
    date: "2025-01-18",
    category: "行业情报",
    sourceCount: 1,
    newItems: 2,
    insights: 1,
    actions: 1,
    summary: "行业情报显示制造业数字化转型加速，多家企业宣布新的智能制造计划。",
    status: "completed",
    generatedAt: "2025-01-18 10:00:00",
    policy: "Industry Policy v1.0"
  },
  {
    id: "5",
    date: "2025-01-17",
    category: "生物AI",
    sourceCount: 2,
    newItems: 4,
    insights: 2,
    actions: 2,
    summary: "生物AI领域昨日发布关于机器学习在药物发现中应用的重要研究成果。",
    status: "completed",
    generatedAt: "2025-01-17 09:00:00",
    policy: "BioAI Policy v2.1"
  }
]

export default function DigestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [selectedDigest, setSelectedDigest] = useState<string | null>(null)

  const filteredDigests = mockDigests.filter(digest => {
    const matchesSearch = digest.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         digest.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || digest.category === categoryFilter
    const matchesDate = !dateFilter || digest.date === format(dateFilter, "yyyy-MM-dd")
    return matchesSearch && matchesCategory && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "generating":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Generating</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      "金融类": "bg-blue-500",
      "生物AI": "bg-green-500", 
      "行业情报": "bg-purple-500",
      "科技": "bg-orange-500"
    }
    return <Badge variant="default" className={colors[category as keyof typeof colors] || "bg-gray-500"}>
      {category}
    </Badge>
  }

  // Group digests by date
  const groupedDigests = filteredDigests.reduce((acc, digest) => {
    if (!acc[digest.date]) {
      acc[digest.date] = []
    }
    acc[digest.date].push(digest)
    return acc
  }, {} as Record<string, typeof mockDigests>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Digests</h1>
          <p className="text-muted-foreground">AI-generated daily summaries and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button>
            Generate Today&apos;s Digest
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search digests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="金融类">金融类</SelectItem>
                <SelectItem value="生物AI">生物AI</SelectItem>
                <SelectItem value="行业情报">行业情报</SelectItem>
                <SelectItem value="科技">科技</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Digests List */}
      <div className="space-y-6">
        {Object.entries(groupedDigests).map(([date, digests]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </div>
                <Badge variant="outline">{digests.length} digests</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {digests.map((digest) => (
                  <Card key={digest.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        {getCategoryBadge(digest.category)}
                        {getStatusBadge(digest.status)}
                      </div>
                      <CardTitle className="text-lg">{digest.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {digest.summary}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{digest.newItems}</div>
                          <div className="text-xs text-muted-foreground">New Items</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{digest.insights}</div>
                          <div className="text-xs text-muted-foreground">Insights</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{digest.actions}</div>
                          <div className="text-xs text-muted-foreground">Actions</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{digest.generatedAt}</span>
                        <span>{digest.policy}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedDigest(digest.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDigests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No digests found</h3>
            <p className="text-muted-foreground text-center mb-4">
              No digests match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
              setDateFilter(undefined)
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Digest Detail Modal */}
      {selectedDigest && (
        <DigestDetailDialog
          digestId={selectedDigest}
          onClose={() => setSelectedDigest(null)}
        />
      )}
    </div>
  )
}
