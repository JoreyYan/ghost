"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface AddCategoryDialogProps {
  onClose: () => void
}

// Mock data for available policies and parent categories
const availablePolicies = [
  { id: "1", name: "Default Policy v1.0", description: "Standard analysis policy" },
  { id: "2", name: "Finance Policy v1.2", description: "Specialized for financial news" },
  { id: "3", name: "BioAI Policy v1.5", description: "Optimized for bioinformatics and AI" },
  { id: "4", name: "Tech Policy v2.0", description: "Technology and startup focused" },
  { id: "5", name: "Industry Policy v1.0", description: "General industry analysis" }
]

const parentCategories = [
  { id: "1", name: "金融类", path: "金融类" },
  { id: "2", name: "生物AI", path: "生物AI" },
  { id: "3", name: "行业情报", path: "行业情报" },
  { id: "1-1", name: "加密货币", path: "金融类 > 加密货币" },
  { id: "1-2", name: "传统金融", path: "金融类 > 传统金融" },
  { id: "2-1", name: "机器学习", path: "生物AI > 机器学习" },
  { id: "2-2", name: "生物信息", path: "生物AI > 生物信息" }
]

export function AddCategoryDialog({ onClose }: AddCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
    defaultPolicy: "",
    autoAssignSources: false,
    priority: "normal"
  })

  const [selectedSources, setSelectedSources] = useState<string[]>([])

  // Mock available sources for assignment
  const availableSources = [
    { id: "1", name: "bioRxiv Latest Papers", type: "RSS", currentCategory: "生物AI" },
    { id: "2", name: "Linus Torvalds", type: "GitHub", currentCategory: "开源" },
    { id: "3", name: "CoinDesk", type: "RSS", currentCategory: "金融" },
    { id: "4", name: "TechCrunch", type: "RSS", currentCategory: "科技" },
    { id: "5", name: "Nature News", type: "RSS", currentCategory: "研究论文" }
  ]

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleSubmit = () => {
    console.log("Creating category:", {
      ...formData,
      assignedSources: selectedSources
    })
    onClose()
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Category</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., 人工智能"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="parent">Parent Category (Optional)</Label>
              <Select value={formData.parentCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, parentCategory: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No parent (Root category)</SelectItem>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Default Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default Analysis Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="policy">Policy</Label>
              <Select value={formData.defaultPolicy} onValueChange={(value) => setFormData(prev => ({ ...prev, defaultPolicy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default policy" />
                </SelectTrigger>
                <SelectContent>
                  {availablePolicies.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      <div>
                        <div className="font-medium">{policy.name}</div>
                        <div className="text-sm text-muted-foreground">{policy.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.defaultPolicy && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Selected Policy:</h4>
                <div className="text-sm text-muted-foreground">
                  {availablePolicies.find(p => p.id === formData.defaultPolicy)?.description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assign Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-assign"
                checked={formData.autoAssignSources}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoAssignSources: !!checked }))}
              />
              <Label htmlFor="auto-assign">Auto-assign sources based on keywords</Label>
            </div>

            <div>
              <Label>Available Sources</Label>
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                {availableSources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      id={`source-${source.id}`}
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={() => handleSourceToggle(source.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{source.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.type} • Currently in: {source.currentCategory}
                      </div>
                    </div>
                    <Badge variant="outline">{source.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {selectedSources.length > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Selected Sources ({selectedSources.length}):</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSources.map((sourceId) => {
                    const source = availableSources.find(s => s.id === sourceId)
                    return (
                      <Badge key={sourceId} variant="secondary" className="text-xs">
                        {source?.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{formData.priority}</Badge>
                <span className="font-medium">{formData.name || "Category Name"}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.description || "Category description will appear here"}
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedSources.length} sources</Badge>
                {formData.defaultPolicy && (
                  <Badge variant="outline">
                    {availablePolicies.find(p => p.id === formData.defaultPolicy)?.name}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name}>
            Create Category
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
