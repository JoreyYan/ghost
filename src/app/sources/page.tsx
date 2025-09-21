"use client"

import { useState, useEffect } from "react"
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
import { EditSourceDialog } from "@/app/sources/edit-source-dialog"
import { supabase } from "@/lib/supabase"

// Type definition for source data
interface Source {
  id: string
  name: string
  kind: string
  handle: string
  active: boolean
  fetch_cron: string | null
  created_at: string
  categories?: string[]
  last_run?: string
  new_items?: number
  health?: string
}

// 获取源的抓取状态
const getSourceStatus = async (sourceId: string) => {
  try {
    const { data: lastRun } = await supabase
      .from('fetch_runs')
      .select('*')
      .eq('source_id', sourceId)
      .eq('ok', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .single()
    
    const { data: itemCount } = await supabase
      .from('items')
      .select('id', { count: 'exact' })
      .eq('source_id', sourceId)
    
    return {
      lastRun: lastRun ? new Date(lastRun.started_at).toLocaleString() : 'Never',
      newItems: lastRun?.new_items || 0,
      totalItems: itemCount?.length || 0,
      health: lastRun ? 'good' : 'unknown'
    }
  } catch (_error) {
    return {
      lastRun: 'Unknown',
      newItems: 0,
      totalItems: 0,
      health: 'error'
    }
  }
}

export default function SourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<{
    id: string
    name: string
    kind: string
    handle: string
  } | null>(null)
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchingSource, setFetchingSource] = useState<string | null>(null)

  // 手动抓取数据源
  const handleFetchSource = async (sourceId: string) => {
    setFetchingSource(sourceId)
    try {
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceId })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`成功抓取 ${result.newItems} 条新数据！`)
        // 刷新页面数据
        window.location.reload()
      } else {
        alert(`抓取失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('抓取过程中发生错误')
    } finally {
      setFetchingSource(null)
    }
  }

         // Fetch sources from database
         useEffect(() => {
           const fetchSources = async () => {
             try {
               const { data, error } = await supabase
                 .from('sources')
                 .select(`
                   *,
                   source_categories (
                     categories (
                       name
                     )
                   )
                 `)
                 .order('created_at', { ascending: false })

              if (error) {
                console.error('Error fetching sources:', error)
                console.error('Error details:', JSON.stringify(error, null, 2))
                alert(`Error fetching sources: ${error.message || 'Unknown error'}`)
                setSources([])
              } else {
                 // Transform database data and get status for each source
                 const transformedSources = await Promise.all(
                   (data || []).map(async (source) => {
                     const status = await getSourceStatus(source.id)
                     return {
                       ...source,
                       categories: source.source_categories?.map((sc: {categories: {name: string}}) => sc.categories?.name).filter(Boolean) || [],
                       last_run: status.lastRun,
                       new_items: status.newItems,
                       health: status.health
                     }
                   })
                 )
                 setSources(transformedSources)
               }
             } catch (err) {
               console.error('Error:', err)
               setSources([])
             } finally {
               setLoading(false)
             }
           }

           fetchSources()
         }, [])

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.handle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && source.active) ||
                         (statusFilter === "inactive" && !source.active)
    const matchesType = typeFilter === "all" || source.kind === typeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (active: boolean, health?: string) => {
    if (!active) {
      return <Clock className="h-4 w-4 text-gray-500" />
    }
    switch (health) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (active: boolean, health?: string) => {
    if (!active) {
      return <Badge variant="outline">Inactive</Badge>
    }
    switch (health) {
      case "good":
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Warning</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="default" className="bg-green-500">Active</Badge>
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
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading sources...</div>
            </div>
          ) : (
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
                      <Badge variant="outline">{source.kind.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {source.categories?.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        )) || <span className="text-muted-foreground text-sm">No categories</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.active, source.health)}
                        {getStatusBadge(source.active, source.health)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {source.last_run || 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(source.new_items || 0) > 0 ? "default" : "outline"}>
                        {source.new_items || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.active, source.health)}
                        <span className="text-sm capitalize">{source.health || 'unknown'}</span>
                      </div>
                    </TableCell>
                           <TableCell>
                             <div className="flex items-center gap-2">
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => handleFetchSource(source.id)}
                                 disabled={fetchingSource === source.id}
                               >
                                 <Play className={`h-4 w-4 ${fetchingSource === source.id ? 'animate-spin' : ''}`} />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => setSelectedSource(source.id)}
                               >
                                 <Eye className="h-4 w-4" />
                               </Button>
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => setEditingSource({
                                   id: source.id,
                                   name: source.name,
                                   kind: source.kind,
                                   handle: source.handle
                                 })}
                               >
                                 <Edit className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="sm">
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </div>
                           </TableCell>
                  </TableRow>
                ))}
                {filteredSources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No sources found. Add your first source to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

             {/* Source Detail Drawer */}
             {selectedSource && (
               <SourceDetailDrawer
                 sourceId={selectedSource}
                 onClose={() => setSelectedSource(null)}
               />
             )}

             {/* Edit Source Dialog */}
             {editingSource && (
               <Dialog open={!!editingSource} onOpenChange={() => setEditingSource(null)}>
                 <EditSourceDialog
                   sourceId={editingSource.id}
                   sourceName={editingSource.name}
                   sourceKind={editingSource.kind}
                   sourceHandle={editingSource.handle}
                   onClose={() => setEditingSource(null)}
                 />
               </Dialog>
             )}
    </div>
  )
}


