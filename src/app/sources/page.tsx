"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Filter, Play, Eye, Edit, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { AddSourceDialog } from "@/components/sources/add-source-dialog"
import { SourceDetailDrawer } from "@/components/sources/source-detail-drawer"

// Mock data
const mockSources = [
  {
    id: "1",
    name: "bioRxiv Latest Papers",
    type: "RSS",
    url: "https://biorxiv.org/rss.xml",
    categories: ["生物AI", "研究论文"],
    status: "active",
    lastRun: "2 hours ago",
    newItems: 3,
    health: "good",
    nextRun: "6 hours"
  },
  {
    id: "2", 
    name: "Linus Torvalds",
    type: "GitHub",
    url: "https://github.com/torvalds",
    categories: ["开源", "技术"],
    status: "active",
    lastRun: "1 hour ago",
    newItems: 2,
    health: "good",
    nextRun: "3 hours"
  },
  {
    id: "3",
    name: "CoinDesk",
    type: "RSS", 
    url: "https://coindesk.com/rss",
    categories: ["金融", "加密货币"],
    status: "warning",
    lastRun: "5 hours ago",
    newItems: 0,
    health: "warning",
    nextRun: "1 hour"
  },
  {
    id: "4",
    name: "TechCrunch",
    type: "RSS",
    url: "https://techcrunch.com/feed",
    categories: ["科技", "创业"],
    status: "inactive",
    lastRun: "2 days ago",
    newItems: 0,
    health: "error",
    nextRun: "Never"
  }
]

export default function SourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredSources = mockSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || source.status === statusFilter
    const matchesType = typeFilter === "all" || source.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "inactive":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Warning</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sources Management</h1>
          <p className="text-muted-foreground">Manage your data sources and monitor their health</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <AddSourceDialog onClose={() => setIsAddDialogOpen(false)} />
        </Dialog>
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
                  placeholder="Search sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RSS">RSS</SelectItem>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources ({filteredSources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>New Items</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {source.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      {getStatusBadge(source.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {source.lastRun}
                  </TableCell>
                  <TableCell>
                    <Badge variant={source.newItems > 0 ? "default" : "outline"}>
                      {source.newItems}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.health)}
                      <span className="text-sm capitalize">{source.health}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedSource(source.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Source Detail Drawer */}
      {selectedSource && (
        <SourceDetailDrawer
          sourceId={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  )
}


