"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  X, 
  Copy, 
  Edit, 
  GitBranch, 
  Users, 
  Calendar,
  FileText,
  Database,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface PolicyDetailDialogProps {
  policyId: string
  onClose: () => void
}

// Mock data for policy details
const mockPolicyDetail = {
  id: "2",
  name: "Finance Policy",
  version: "v1.0",
  scope: "Category",
  description: "Specialized policy for financial news analysis with focus on market trends and investment opportunities",
  status: "active",
  createdAt: "2025-01-10",
  author: "Admin",
  lastModified: "2025-01-15",
  usageCount: 12,
  appliedTo: [
    { type: "category", name: "金融类", id: "1" },
    { type: "category", name: "加密货币", id: "1-1" }
  ],
  configuration: {
    summary: {
      targetLength: "150",
      language: "chinese",
      style: "professional",
      includeReferences: true,
      uncertaintyHandling: "explicit"
    },
    insights: {
      count: "4",
      focusAreas: ["trends", "impact", "risks", "opportunities"],
      includeQuantitative: true,
      highlightActionable: true
    },
    extraction: {
      schema: "finance",
      confidenceThreshold: "0.8",
      fields: {
        financial: ["amount", "currency", "round", "investors", "valuation", "ticker"],
        market: ["price", "volume", "market_cap", "change_percent"],
        company: ["name", "sector", "revenue", "employees"]
      }
    },
    actions: {
      count: "3",
      targetAudience: "investors",
      includeSpecificSteps: true,
      prioritizeByImportance: true
    }
  },
  inheritance: {
    basePolicy: "Default Policy v1.2",
    overrides: [
      { field: "extraction.fields.financial", value: "Extended financial fields", original: "Basic financial fields" },
      { field: "insights.focusAreas", value: "Added 'opportunities'", original: "Standard focus areas" }
    ]
  },
  versionHistory: [
    { version: "v1.0", date: "2025-01-10", author: "Admin", changes: "Initial version" },
    { version: "v0.9", date: "2025-01-08", author: "Admin", changes: "Draft version" }
  ],
  usageStats: [
    { date: "2025-01-19", digestsGenerated: 3, avgScore: 4.2 },
    { date: "2025-01-18", digestsGenerated: 2, avgScore: 4.5 },
    { date: "2025-01-17", digestsGenerated: 4, avgScore: 4.1 },
    { date: "2025-01-16", digestsGenerated: 1, avgScore: 4.3 }
  ]
}

export function PolicyDetailDialog({ policyId: _policyId, onClose }: PolicyDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Draft</Badge>
      case "deprecated":
        return <Badge variant="destructive">Deprecated</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getScopeBadge = (scope: string) => {
    switch (scope) {
      case "Global":
        return <Badge variant="default">Global</Badge>
      case "Category":
        return <Badge variant="secondary">Category</Badge>
      case "Source":
        return <Badge variant="outline">Source</Badge>
      default:
        return <Badge variant="outline">{scope}</Badge>
    }
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="flex items-center gap-2">
              {mockPolicyDetail.name}
              <Badge variant="outline" className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {mockPolicyDetail.version}
              </Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{mockPolicyDetail.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Status</span>
              </div>
              {getStatusBadge(mockPolicyDetail.status)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Scope</span>
              </div>
              {getScopeBadge(mockPolicyDetail.scope)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Usage</span>
              </div>
              <div className="text-lg font-bold">{mockPolicyDetail.usageCount}</div>
              <div className="text-xs text-muted-foreground">times used</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <div className="text-sm">{mockPolicyDetail.createdAt}</div>
              <div className="text-xs text-muted-foreground">by {mockPolicyDetail.author}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <GitBranch className="mr-2 h-4 w-4" />
            New Version
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="inheritance">Inheritance</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applied To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockPolicyDetail.appliedTo.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Target Length:</span>
                    <span className="ml-2 font-medium">{mockPolicyDetail.configuration.summary.targetLength} words</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="ml-2 font-medium">{mockPolicyDetail.configuration.summary.language}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Insights Count:</span>
                    <span className="ml-2 font-medium">{mockPolicyDetail.configuration.insights.count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence Threshold:</span>
                    <span className="ml-2 font-medium">{mockPolicyDetail.configuration.extraction.confidenceThreshold}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Summary Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Target Length:</strong> {mockPolicyDetail.configuration.summary.targetLength} words</div>
                  <div><strong>Language:</strong> {mockPolicyDetail.configuration.summary.language}</div>
                  <div><strong>Style:</strong> {mockPolicyDetail.configuration.summary.style}</div>
                  <div><strong>References:</strong> {mockPolicyDetail.configuration.summary.includeReferences ? "Yes" : "No"}</div>
                  <div><strong>Uncertainty:</strong> {mockPolicyDetail.configuration.summary.uncertaintyHandling}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Insights Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Count:</strong> {mockPolicyDetail.configuration.insights.count}</div>
                  <div><strong>Focus Areas:</strong></div>
                  <div className="flex flex-wrap gap-1 ml-4">
                    {mockPolicyDetail.configuration.insights.focusAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">{area}</Badge>
                    ))}
                  </div>
                  <div><strong>Quantitative Data:</strong> {mockPolicyDetail.configuration.insights.includeQuantitative ? "Yes" : "No"}</div>
                  <div><strong>Actionable Insights:</strong> {mockPolicyDetail.configuration.insights.highlightActionable ? "Yes" : "No"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Extraction Schema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div><strong>Confidence Threshold:</strong> {mockPolicyDetail.configuration.extraction.confidenceThreshold}</div>
                  <div>
                    <strong>Financial Fields:</strong>
                    <div className="flex flex-wrap gap-1 ml-4 mt-1">
                      {mockPolicyDetail.configuration.extraction.fields.financial.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">{field}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Market Fields:</strong>
                    <div className="flex flex-wrap gap-1 ml-4 mt-1">
                      {mockPolicyDetail.configuration.extraction.fields.market.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">{field}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inheritance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inheritance Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Default Policy v1.2</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="secondary">Finance Policy v1.0</Badge>
                    <span className="text-sm text-muted-foreground">(Current)</span>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Overrides</h4>
                    <div className="space-y-2 text-sm">
                      {mockPolicyDetail.inheritance.overrides.map((override, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <div className="font-medium">{override.field}</div>
                            <div className="text-muted-foreground">
                              <span className="line-through">{override.original}</span> → <span className="text-green-600">{override.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPolicyDetail.versionHistory.map((version) => (
                      <TableRow key={version.version}>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {version.version}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{version.date}</TableCell>
                        <TableCell className="text-sm">{version.author}</TableCell>
                        <TableCell className="text-sm">{version.changes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Digests Generated</TableHead>
                      <TableHead>Average Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPolicyDetail.usageStats.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">{stat.date}</TableCell>
                        <TableCell className="text-sm">{stat.digestsGenerated}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <span>{stat.avgScore}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < Math.floor(stat.avgScore) ? 'bg-yellow-400' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  )
}


