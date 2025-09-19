"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Users,
  Building2,
  Star,
  Activity,
  Github,
  Twitter,
  Globe,
  MapPin,
  Briefcase,
  Award
} from "lucide-react"

// Mock data for entities
const mockEntities = [
  {
    id: "1",
    name: "Linus Torvalds",
    type: "person",
    avatar: "https://github.com/torvalds.png",
    bio: "Linux kernel creator and maintainer",
    organization: "Linux Foundation",
    location: "Portland, Oregon",
    sources: ["GitHub", "LWN.net", "Kernel.org"],
    topics: ["Linux", "内核", "C语言", "开源", "系统编程"],
    activity: {
      totalItems: 1247,
      thisWeek: 15,
      lastActivity: "2 hours ago"
    },
    influence: "high",
    verified: true,
    social: {
      github: "torvalds",
      twitter: null,
      website: "https://kernel.org"
    }
  },
  {
    id: "2",
    name: "Vitalik Buterin",
    type: "person",
    avatar: "https://github.com/vbuterin.png",
    bio: "Ethereum co-founder and researcher",
    organization: "Ethereum Foundation",
    location: "Global",
    sources: ["Twitter", "GitHub", "Medium", "Ethereum.org"],
    topics: ["区块链", "以太坊", "DeFi", "NFT", "加密货币"],
    activity: {
      totalItems: 892,
      thisWeek: 8,
      lastActivity: "4 hours ago"
    },
    influence: "high",
    verified: true,
    social: {
      github: "vbuterin",
      twitter: "VitalikButerin",
      website: "https://vitalik.ca"
    }
  },
  {
    id: "3",
    name: "OpenAI",
    type: "organization",
    avatar: "https://openai.com/favicon.ico",
    bio: "AI research company focused on artificial general intelligence",
    organization: "OpenAI",
    location: "San Francisco, CA",
    sources: ["OpenAI Blog", "GitHub", "Twitter", "Papers"],
    topics: ["AI", "机器学习", "GPT", "AGI", "研究"],
    activity: {
      totalItems: 2156,
      thisWeek: 23,
      lastActivity: "1 hour ago"
    },
    influence: "high",
    verified: true,
    social: {
      github: "openai",
      twitter: "OpenAI",
      website: "https://openai.com"
    }
  },
  {
    id: "4",
    name: "Nature",
    type: "organization",
    avatar: "https://nature.com/favicon.ico",
    bio: "International weekly journal of science",
    organization: "Nature Publishing Group",
    location: "London, UK",
    sources: ["Nature.com", "Twitter", "RSS"],
    topics: ["科学", "研究", "期刊", "学术", "出版"],
    activity: {
      totalItems: 3456,
      thisWeek: 45,
      lastActivity: "30 minutes ago"
    },
    influence: "high",
    verified: true,
    social: {
      github: null,
      twitter: "Nature",
      website: "https://nature.com"
    }
  },
  {
    id: "5",
    name: "Andrej Karpathy",
    type: "person",
    avatar: "https://github.com/karpathy.png",
    bio: "AI researcher, former Tesla AI Director",
    organization: "Independent",
    location: "San Francisco, CA",
    sources: ["Twitter", "GitHub", "YouTube", "Blog"],
    topics: ["AI", "深度学习", "计算机视觉", "自动驾驶", "教育"],
    activity: {
      totalItems: 567,
      thisWeek: 12,
      lastActivity: "6 hours ago"
    },
    influence: "high",
    verified: true,
    social: {
      github: "karpathy",
      twitter: "karpathy",
      website: "https://karpathy.github.io"
    }
  }
]

export default function EntitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [influenceFilter, setInfluenceFilter] = useState("all")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)

  const filteredEntities = mockEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === "all" || entity.type === typeFilter
    const matchesInfluence = influenceFilter === "all" || entity.influence === influenceFilter
    
    return matchesSearch && matchesType && matchesInfluence
  })

  const getInfluenceBadge = (influence: string) => {
    switch (influence) {
      case "high":
        return <Badge variant="destructive">High Influence</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium Influence</Badge>
      case "low":
        return <Badge variant="outline">Low Influence</Badge>
      default:
        return <Badge variant="outline">{influence}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "person" ? <Users className="h-4 w-4" /> : <Building2 className="h-4 w-4" />
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">People & Organizations</h1>
          <p className="text-muted-foreground">Track influential people and organizations across your sources</p>
        </div>
        <Button>
          Add Entity
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Entities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search people and organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="person">People</SelectItem>
                <SelectItem value="organization">Organizations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={influenceFilter} onValueChange={setInfluenceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Influence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map((entity) => (
          <Card key={entity.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={entity.avatar} alt={entity.name} />
                  <AvatarFallback>
                    {entity.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{entity.name}</CardTitle>
                    {entity.verified && (
                      <Badge variant="default" className="bg-blue-500 text-xs">
                        <Award className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getTypeIcon(entity.type)}
                    <span>{entity.type === "person" ? "Person" : "Organization"}</span>
                    {entity.location && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entity.location}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{entity.bio}</p>
              
              {entity.organization && entity.type === "person" && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{entity.organization}</span>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {entity.topics.slice(0, 4).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {entity.topics.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{entity.topics.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{entity.activity.totalItems}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{entity.activity.thisWeek}</div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{entity.sources.length}</div>
                  <div className="text-xs text-muted-foreground">Sources</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {getInfluenceBadge(entity.influence)}
                <div className="flex gap-1">
                  {entity.social.github && (
                    <Button variant="ghost" size="sm">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {entity.social.twitter && (
                    <Button variant="ghost" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {entity.social.website && (
                    <Button variant="ghost" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedEntity(entity.id)}
                >
                  <Activity className="mr-1 h-3 w-3" />
                  View Timeline
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No entities found</h3>
            <p className="text-muted-foreground text-center mb-4">
              No entities match your current search criteria. Try adjusting your filters.
            </p>
            <Button onClick={() => {
              setSearchTerm("")
              setTypeFilter("all")
              setInfluenceFilter("all")
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Entity Detail Modal */}
      {selectedEntity && (
        <EntityDetailDialog
          entityId={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  )
}

// Placeholder for EntityDetailDialog component
function EntityDetailDialog({ onClose }: { entityId: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Entity Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>Entity detail content will be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  )
}


