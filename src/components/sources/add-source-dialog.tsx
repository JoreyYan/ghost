"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, TestTube } from "lucide-react"

interface AddSourceDialogProps {
  onClose: () => void
}

export function AddSourceDialog({ onClose }: AddSourceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    url: "",
    categories: [] as string[],
    schedule: "daily",
    time: "08:00",
    description: ""
  })

  const [newCategory, setNewCategory] = useState("")
  const [testResults, setTestResults] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const availableCategories = ["金融", "生物AI", "科技", "开源", "研究论文", "加密货币", "创业", "技术", "行业情报"]

  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }))
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const handleTestSource = async () => {
    setIsTesting(true)
    // Mock test - simulate API call
    setTimeout(() => {
      setTestResults({
        success: true,
        itemsFound: 5,
        lastItem: "Latest article: AI breakthrough in protein folding",
        sampleItems: [
          "New research shows improved accuracy in protein structure prediction",
          "Machine learning model achieves 95% accuracy on benchmark dataset",
          "Open source implementation now available on GitHub"
        ]
      })
      setIsTesting(false)
    }, 2000)
  }

  const handleSubmit = () => {
    console.log("Creating source:", formData)
    onClose()
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Data Source</DialogTitle>
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
                placeholder="e.g., bioRxiv Latest Papers"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Source Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RSS">RSS Feed</SelectItem>
                  <SelectItem value="GitHub">GitHub User/Repo</SelectItem>
                  <SelectItem value="JSON">JSON API</SelectItem>
                  <SelectItem value="HTML">HTML Scraper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url">URL/Handle</Label>
              <Input
                id="url"
                placeholder={formData.type === "GitHub" ? "username or owner/repo" : "https://example.com/feed.xml"}
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this source..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveCategory(category)}
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories
                    .filter(cat => !formData.categories.includes(cat))
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div>
                <Label htmlFor="schedule">Frequency</Label>
                <Select value={formData.schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time">Time (JST)</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-[150px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleTestSource} 
              disabled={!formData.url || isTesting}
              variant="outline"
            >
              {isTesting ? "Testing..." : "Test Fetch"}
            </Button>
            
            {testResults && (
              <div className="p-4 border rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Test Results</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {testResults.success ? "✅ Success" : "❌ Failed"}</p>
                  <p><strong>Items Found:</strong> {testResults.itemsFound}</p>
                  <p><strong>Latest Item:</strong> {testResults.lastItem}</p>
                  <div>
                    <strong>Sample Items:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {testResults.sampleItems.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name || !formData.type || !formData.url}>
            Create Source
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
