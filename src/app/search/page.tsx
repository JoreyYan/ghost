"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Star,
  TrendingUp,
  Brain,
  FileText,
  Users,
  Tag,
  SortAsc,
  SortDesc
} from "lucide-react"

// Mock search results
const mockSearchResults = [
  {
    id: "1",
    title: "Bitcoin突破新高，机构投资者增持明显",
    content: "比特币价格突破$50,000大关，创下近期新高。多家机构投资者宣布增持比特币，市场情绪整体乐观。",
    source: "CoinDesk",
    category: "金融类",
    publishedAt: "2025-01-19 08:00:00",
    url: "https://coindesk.com/bitcoin-breaks-50000",
    importance: "high",
    type: "article",
    tags: ["比特币", "加密货币", "投资"],
    digestId: "1"
  },
  {
    id: "2",
    title: "AI模型在蛋白质结构预测任务上取得新突破",
    content: "最新研究显示，基于深度学习的蛋白质结构预测模型在基准测试中达到了95%的准确率，相比之前提升了15%。",
    source: "bioRxiv",
    category: "生物AI",
    publishedAt: "2025-01-19 09:30:00",
    url: "https://biorxiv.org/protein-prediction-breakthrough",
    importance: "high",
    type: "research",
    tags: ["AI", "蛋白质", "机器学习"],
    digestId: "2"
  },
  {
    id: "3",
    title: "央行数字货币试点范围进一步扩大",
    content: "央行宣布数字人民币试点范围从一线城市扩展到更多地区，多家银行宣布参与数字人民币测试。",
    source: "央行官网",
    category: "金融类",
    publishedAt: "2025-01-19 09:30:00",
    url: "https://pbc.gov.cn/digital-yuan-expansion",
    importance: "medium",
    type: "policy",
    tags: ["数字货币", "央行", "政策"],
    digestId: "1"
  },
  {
    id: "4",
    title: "Linus Torvalds发布Linux内核6.8版本",
    content: "Linux内核维护者Linus Torvalds发布了6.8版本，包含多项性能优化和新功能。",
    source: "GitHub",
    category: "开源",
    publishedAt: "2025-01-19 10:30:00",
    url: "https://github.com/torvalds/linux/releases/tag/v6.8",
    importance: "medium",
    type: "release",
    tags: ["Linux", "开源", "内核"],
    digestId: null
  },
  {
    id: "5",
    title: "AI金融科技公司获得5000万美元融资",
    content: "专注于AI+金融的科技公司宣布完成B轮融资，融资金额达5000万美元，将用于产品研发和市场扩张。",
    source: "TechCrunch",
    category: "金融类",
    publishedAt: "2025-01-19 10:15:00",
    url: "https://techcrunch.com/ai-fintech-funding",
    importance: "high",
    type: "news",
    tags: ["AI", "金融科技", "融资"],
    digestId: "1"
  }
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSemanticSearch, setIsSemanticSearch] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [importanceFilter, setImportanceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("list")

  const filteredResults = mockSearchResults.filter(result => {
    const matchesSearch = searchTerm === "" || 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === "all" || result.category === categoryFilter
    const matchesType = typeFilter === "all" || result.type === typeFilter
    const matchesImportance = importanceFilter === "all" || result.importance === importanceFilter
    
    return matchesSearch && matchesCategory && matchesType && matchesImportance
  })

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{importance}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "research":
        return <Brain className="h-4 w-4 text-green-500" />
      case "policy":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "release":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "news":
        return <FileText className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      "金融类": "bg-blue-500",
      "生物AI": "bg-green-500",
      "开源": "bg-purple-500",
      "行业情报": "bg-orange-500"
    }
    return <Badge variant="default" className={colors[category as keyof typeof colors] || "bg-gray-500"}>
      {category}
    </Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Search Intelligence</h1>
          <p className="text-muted-foreground">Search across all news sources and digests</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="semantic-toggle" className="text-sm">Semantic Search</Label>
          <Switch
            id="semantic-toggle"
            checked={isSemanticSearch}
            onCheckedChange={setIsSemanticSearch}
          />
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={isSemanticSearch ? "Describe what you're looking for..." : "Search keywords..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-20 h-12 text-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {isSemanticSearch && (
                <Badge variant="secondary" className="text-xs">
                  <Brain className="mr-1 h-3 w-3" />
                  AI
                </Badge>
              )}
              <Button size="sm">Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div>
              <Label htmlFor="category-filter" className="text-sm">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="金融类">金融类</SelectItem>
                  <SelectItem value="生物AI">生物AI</SelectItem>
                  <SelectItem value="开源">开源</SelectItem>
                  <SelectItem value="行业情报">行业情报</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type-filter" className="text-sm">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="release">Releases</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="importance-filter" className="text-sm">Importance</Label>
              <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-filter" className="text-sm">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="importance">Importance</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Search Results ({filteredResults.length})
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              Timeline
            </Button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(result.type)}
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    {getImportanceBadge(result.importance)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {result.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {result.source}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {result.publishedAt}
                    </div>
                    {result.digestId && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        In Digest #{result.digestId}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(result.category)}
                    <div className="flex gap-1">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="mr-1 h-2 w-2" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Star className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
              setTypeFilter("all")
              setImportanceFilter("all")
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Suggestions */}
      {searchTerm && filteredResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Related: "AI 金融"
              </Button>
              <Button variant="outline" size="sm">
                Related: "机器学习"
              </Button>
              <Button variant="outline" size="sm">
                Related: "投资分析"
              </Button>
              <Button variant="outline" size="sm">
                Related: "政策解读"
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
