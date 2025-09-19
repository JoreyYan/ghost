"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  X, 
  Play, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Activity,
} from "lucide-react"

interface SourceDetailDrawerProps {
  sourceId: string
  onClose: () => void
}

// Mock data for source details
const mockSourceDetail = {
  id: "1",
  name: "bioRxiv Latest Papers",
  type: "RSS",
  url: "https://biorxiv.org/rss.xml",
  categories: ["生物AI", "研究论文"],
  status: "active",
  description: "Latest research papers from bioRxiv preprint server",
  schedule: "daily",
  time: "08:00",
  lastRun: "2 hours ago",
  nextRun: "6 hours",
  health: "good",
  totalItems: 1247,
  newItems: 3,
  errorCount: 0,
  avgResponseTime: "1.2s"
}

const mockRunLogs = [
  {
    id: "1",
    timestamp: "2025-01-19 10:00:00",
    status: "success",
    duration: "1.2s",
    newItems: 3,
    error: null
  },
  {
    id: "2", 
    timestamp: "2025-01-19 08:00:00",
    status: "success",
    duration: "0.8s",
    newItems: 2,
    error: null
  },
  {
    id: "3",
    timestamp: "2025-01-18 20:00:00",
    status: "warning",
    duration: "3.1s",
    newItems: 1,
    error: "Rate limit exceeded, retrying..."
  },
  {
    id: "4",
    timestamp: "2025-01-18 08:00:00",
    status: "success",
    duration: "1.5s",
    newItems: 4,
    error: null
  }
]

const mockRecentItems = [
  {
    id: "1",
    title: "Deep learning approach to protein structure prediction",
    author: "Smith et al.",
    publishedAt: "2025-01-19 09:30:00",
    url: "https://biorxiv.org/content/10.1101/2025.01.19.123456",
    categories: ["机器学习", "蛋白质"]
  },
  {
    id: "2",
    title: "Novel algorithm for genome sequence alignment",
    author: "Johnson et al.",
    publishedAt: "2025-01-19 08:15:00",
    url: "https://biorxiv.org/content/10.1101/2025.01.19.123457",
    categories: ["基因组学", "算法"]
  },
  {
    id: "3",
    title: "CRISPR-based gene editing in mammalian cells",
    author: "Brown et al.",
    publishedAt: "2025-01-19 07:45:00",
    url: "https://biorxiv.org/content/10.1101/2025.01.19.123458",
    categories: ["CRISPR", "基因编辑"]
  }
]

export function SourceDetailDrawer({ sourceId: _sourceId, onClose }: SourceDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500">Success</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Warning</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-[600px] bg-background border-l shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{mockSourceDetail.name}</h2>
              <p className="text-sm text-muted-foreground">{mockSourceDetail.type} Source</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(mockSourceDetail.status)}
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant={mockSourceDetail.status === "active" ? "default" : "outline"}>
                  {mockSourceDetail.status}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <Badge variant={mockSourceDetail.health === "good" ? "default" : "destructive"}>
                  {mockSourceDetail.health}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Test Fetch
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="logs">Run Logs</TabsTrigger>
              <TabsTrigger value="items">Recent Items</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">URL:</span>
                    <span className="text-sm font-mono">{mockSourceDetail.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Schedule:</span>
                    <span className="text-sm">{mockSourceDetail.schedule} at {mockSourceDetail.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Categories:</span>
                    <div className="flex gap-1">
                      {mockSourceDetail.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <span className="text-sm">{mockSourceDetail.description}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{mockSourceDetail.totalItems}</div>
                      <div className="text-sm text-muted-foreground">Total Items</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockSourceDetail.newItems}</div>
                      <div className="text-sm text-muted-foreground">New Items</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockSourceDetail.errorCount}</div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockSourceDetail.avgResponseTime}</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Run History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>New Items</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRunLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">{log.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(log.status)}
                              {getStatusBadge(log.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{log.duration}</TableCell>
                          <TableCell className="text-sm">{log.newItems}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.error || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>By {item.author}</span>
                          <span>{item.publishedAt}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {item.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          View Original →
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


