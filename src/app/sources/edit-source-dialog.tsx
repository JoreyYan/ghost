"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    handle: sourceHandle
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('sources')
        .update({
          name: formData.name,
          kind: formData.kind,
          handle: formData.handle
        })
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

  return (
    <DialogContent className="max-w-2xl">
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
