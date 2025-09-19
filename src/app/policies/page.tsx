"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Settings, Copy, Eye, GitBranch, AlertCircle } from "lucide-react"
import { AddPolicyDialog } from "@/components/policies/add-policy-dialog"
import { PolicyDetailDialog } from "@/components/policies/policy-detail-dialog"

// Mock data for policies
const mockPolicies = [
  {
    id: "1",
    name: "Default Policy",
    version: "v1.2",
    scope: "Global",
    lastUsed: "2 hours ago",
    usageCount: 45,
    status: "active",
    description: "Standard analysis policy for general news",
    createdAt: "2025-01-15",
    author: "System"
  },
  {
    id: "2",
    name: "Finance Policy",
    version: "v1.0",
    scope: "Category",
    lastUsed: "1 hour ago", 
    usageCount: 12,
    status: "active",
    description: "Specialized policy for financial news analysis",
    createdAt: "2025-01-10",
    author: "Admin"
  },
  {
    id: "3",
    name: "BioAI Policy",
    version: "v2.1",
    scope: "Category",
    lastUsed: "30 minutes ago",
    usageCount: 8,
    status: "active",
    description: "Optimized for bioinformatics and AI research",
    createdAt: "2025-01-12",
    author: "Researcher"
  },
  {
    id: "4",
    name: "Tech Policy",
    version: "v1.5",
    scope: "Source",
    lastUsed: "Never",
    usageCount: 0,
    status: "draft",
    description: "Technology and startup focused analysis",
    createdAt: "2025-01-18",
    author: "Developer"
  }
]

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [scopeFilter, setScopeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesScope = scopeFilter === "all" || policy.scope.toLowerCase() === scopeFilter
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter
    return matchesSearch && matchesScope && matchesStatus
  })

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policies Management</h1>
          <p className="text-muted-foreground">Create and manage analysis policies for different sources and categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Policy
            </Button>
          </DialogTrigger>
          <AddPolicyDialog onClose={() => setIsAddDialogOpen(false)} />
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
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Policies ({filteredPolicies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-sm text-muted-foreground">{policy.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {policy.version}
                    </Badge>
                  </TableCell>
                  <TableCell>{getScopeBadge(policy.scope)}</TableCell>
                  <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{policy.usageCount}</div>
                      <div className="text-muted-foreground">times used</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {policy.lastUsed}
                  </TableCell>
                  <TableCell className="text-sm">{policy.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedPolicy(policy.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Policy Builder Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Policy Builder Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="extract">Extract</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Summary Configuration</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Target length: 100-200 words</p>
                  <p>• Language: Chinese</p>
                  <p>• Style: Professional, concise</p>
                  <p>• Include numbered references: Yes</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Insights Template</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Generate 3-5 bullet points</p>
                  <p>• Focus areas: trends, impact, risks, opportunities</p>
                  <p>• Include quantitative data when available</p>
                  <p>• Highlight actionable insights</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="extract" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Data Extraction Schema</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Financial: amount, currency, round, investors</p>
                  <p>• Research: dataset, metrics, model, parameters</p>
                  <p>• Technology: product, version, features, compatibility</p>
                  <p>• Confidence threshold: 0.8</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Action Items Generation</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Generate 3-5 actionable items</p>
                  <p>• Target audience: researchers, investors, developers</p>
                  <p>• Include specific next steps</p>
                  <p>• Prioritize by importance and urgency</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Policy Detail Dialog */}
      {selectedPolicy && (
        <PolicyDetailDialog
          policyId={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </div>
  )
}
