"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface EditSourceDialogProps {
  sourceId: string
  sourceName: string
  sourceKind: string
  sourceHandle: string
  onClose: () => void
}

export function EditSourceDialog({ 
  sourceId, 
  sourceName, 
  sourceKind, 
  sourceHandle, 
  onClose 
}: EditSourceDialogProps) {
  const [formData, setFormData] = useState({
    name: sourceName,
    kind: sourceKind,
    handle: sourceHandle,
    description: "",
    aiFocus: ""
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // 获取现有数据源的详细信息
  useEffect(() => {
    const fetchSourceDetails = async () => {
      try {
        // 先尝试获取所有列
        const { data, error } = await supabase
          .from('sources')
          .select('*')
          .eq('id', sourceId)
          .single()

        if (error) {
          console.error('Error fetching source details:', error)
          // 如果查询失败，可能是列不存在，我们继续使用默认值
        } else if (data) {
          setFormData(prev => ({
            ...prev,
            description: data.description || "",
            aiFocus: data.ai_focus || ""
          }))
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        // 即使出错也继续，使用默认值
      } finally {
        setInitialLoading(false)
      }
    }

    fetchSourceDetails()
  }, [sourceId])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 构建更新数据，只包含基本字段
      const updateData = {
        name: formData.name,
        kind: formData.kind,
        handle: formData.handle
      }

      // 尝试添加新字段（如果列存在的话）
      try {
        // 先测试这些列是否存在
        const { error: testError } = await supabase
          .from('sources')
          .select('description, ai_focus')
          .eq('id', sourceId)
          .limit(1)

        if (!testError) {
          // 列存在，可以安全更新
          updateData.description = formData.description
          updateData.ai_focus = formData.aiFocus
        }
      } catch (err) {
        console.log('New columns not available, updating basic fields only')
      }

      const { error } = await supabase
        .from('sources')
        .update(updateData)
        .eq('id', sourceId)

      if (error) {
        console.error('Error updating source:', error)
        alert('Failed to update source: ' + error.message)
        return
      }

      alert('Source updated successfully!')
      onClose()
      window.location.reload()
      
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Data Source</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading source details...</div>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Data Source</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Source Name</Label>
              <Input
                id="name"
                placeholder="e.g., Protein Design Papers RSS"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Source Type</Label>
              <Select value={formData.kind} onValueChange={(value) => setFormData(prev => ({ ...prev, kind: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rss">RSS Feed</SelectItem>
                  <SelectItem value="github_repo">GitHub Repository</SelectItem>
                  <SelectItem value="github_user">GitHub User</SelectItem>
                  <SelectItem value="json">JSON API</SelectItem>
                  <SelectItem value="html">HTML Scraper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="url">Source URL</Label>
              <Input
                id="url"
                placeholder="e.g., https://github.com/user/repo/commits.atom"
                value={formData.handle}
                onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this source..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="aiFocus">AI 分析重点</Label>
              <Textarea
                id="aiFocus"
                placeholder="告诉 AI 这个数据源主要关注什么，应该重点分析什么内容..."
                value={formData.aiFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, aiFocus: e.target.value }))}
                rows={4}
              />
              <div className="text-sm text-muted-foreground mt-1">
                例如：这是一个蛋白质设计论文集合，请重点关注新添加的论文、研究方法、技术突破、作者信息等
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              For GitHub repositories, you can use these RSS feeds:
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Commits</Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  https://github.com/Peldom/papers_for_protein_design_using_DL/commits.atom
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    kind: 'rss',
                    handle: 'https://github.com/Peldom/papers_for_protein_design_using_DL/commits.atom'
                  }))}
                >
                  Use
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Releases</Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  https://github.com/Peldom/papers_for_protein_design_using_DL/releases.atom
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    kind: 'rss',
                    handle: 'https://github.com/Peldom/papers_for_protein_design_using_DL/releases.atom'
                  }))}
                >
                  Use
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.kind || !formData.handle || loading}
          >
            {loading ? "Updating..." : "Update Source"}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
