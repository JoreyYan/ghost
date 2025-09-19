"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Database, Zap } from "lucide-react"

interface AddPolicyDialogProps {
  onClose: () => void
}

export function AddPolicyDialog({ onClose }: AddPolicyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scope: "global",
    basePolicy: "",
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
      schema: "default",
      confidenceThreshold: "0.8",
      fields: {
        financial: ["amount", "currency", "round", "investors"],
        research: ["dataset", "metrics", "model", "parameters"],
        technology: ["product", "version", "features", "compatibility"]
      }
    },
    actions: {
      count: "3",
      targetAudience: "researchers",
      includeSpecificSteps: true,
      prioritizeByImportance: true
    }
  })

  const [activeTab, setActiveTab] = useState("basic")

  const handleSubmit = () => {
    console.log("Creating policy:", formData)
    onClose()
  }

  const handleFocusAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      insights: {
        ...prev.insights,
        focusAreas: prev.insights.focusAreas.includes(area)
          ? prev.insights.focusAreas.filter(a => a !== area)
          : [...prev.insights.focusAreas, area]
      }
    }))
  }

  const availableFocusAreas = [
    { id: "trends", label: "Trends", description: "Market and industry trends" },
    { id: "impact", label: "Impact", description: "Potential impact assessment" },
    { id: "risks", label: "Risks", description: "Risk identification and analysis" },
    { id: "opportunities", label: "Opportunities", description: "Growth opportunities" },
    { id: "competition", label: "Competition", description: "Competitive landscape" },
    { id: "regulation", label: "Regulation", description: "Regulatory changes" }
  ]

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Analysis Policy</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Policy Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Advanced Finance Analysis Policy"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this policy's purpose and use cases..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="scope">Scope</Label>
                  <Select value={formData.scope} onValueChange={(value) => setFormData(prev => ({ ...prev, scope: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global (Default for all sources)</SelectItem>
                      <SelectItem value="category">Category (Apply to specific categories)</SelectItem>
                      <SelectItem value="source">Source (Apply to specific sources)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="basePolicy">Base Policy (Optional)</Label>
                  <Select value={formData.basePolicy} onValueChange={(value) => setFormData(prev => ({ ...prev, basePolicy: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select base policy to inherit from" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No base policy</SelectItem>
                      <SelectItem value="default">Default Policy v1.2</SelectItem>
                      <SelectItem value="finance">Finance Policy v1.0</SelectItem>
                      <SelectItem value="bioai">BioAI Policy v2.1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Summary Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetLength">Target Length (words)</Label>
                    <Input
                      id="targetLength"
                      type="number"
                      value={formData.summary.targetLength}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        summary: { ...prev.summary, targetLength: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.summary.language} onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      summary: { ...prev.summary, language: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="style">Writing Style</Label>
                  <Select value={formData.summary.style} onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    summary: { ...prev.summary, style: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeReferences"
                      checked={formData.summary.includeReferences}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        summary: { ...prev.summary, includeReferences: !!checked }
                      }))}
                    />
                    <Label htmlFor="includeReferences">Include numbered references</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="uncertaintyHandling">Uncertainty Handling</Label>
                  <Select value={formData.summary.uncertaintyHandling} onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    summary: { ...prev.summary, uncertaintyHandling: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="explicit">Explicit (state when uncertain)</SelectItem>
                      <SelectItem value="implicit">Implicit (avoid uncertain statements)</SelectItem>
                      <SelectItem value="qualified">Qualified (use hedging language)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Insights Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="insightCount">Number of Insights</Label>
                  <Input
                    id="insightCount"
                    type="number"
                    value={formData.insights.count}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      insights: { ...prev.insights, count: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label>Focus Areas</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableFocusAreas.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`focus-${area.id}`}
                          checked={formData.insights.focusAreas.includes(area.id)}
                          onCheckedChange={() => handleFocusAreaToggle(area.id)}
                        />
                        <Label htmlFor={`focus-${area.id}`} className="text-sm">
                          {area.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeQuantitative"
                      checked={formData.insights.includeQuantitative}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        insights: { ...prev.insights, includeQuantitative: !!checked }
                      }))}
                    />
                    <Label htmlFor="includeQuantitative">Include quantitative data</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="highlightActionable"
                      checked={formData.insights.highlightActionable}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        insights: { ...prev.insights, highlightActionable: !!checked }
                      }))}
                    />
                    <Label htmlFor="highlightActionable">Highlight actionable insights</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Extraction Schema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                  <Input
                    id="confidenceThreshold"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.extraction.confidenceThreshold}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      extraction: { ...prev.extraction, confidenceThreshold: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label>Extraction Fields by Category</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Financial Fields</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.extraction.fields.financial.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Research Fields</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.extraction.fields.research.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Technology Fields</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.extraction.fields.technology.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Items Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="actionCount">Number of Action Items</Label>
                  <Input
                    id="actionCount"
                    type="number"
                    value={formData.actions.count}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      actions: { ...prev.actions, count: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.actions.targetAudience} onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    actions: { ...prev.actions, targetAudience: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="researchers">Researchers</SelectItem>
                      <SelectItem value="investors">Investors</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="executives">Executives</SelectItem>
                      <SelectItem value="general">General Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSpecificSteps"
                      checked={formData.actions.includeSpecificSteps}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        actions: { ...prev.actions, includeSpecificSteps: !!checked }
                      }))}
                    />
                    <Label htmlFor="includeSpecificSteps">Include specific next steps</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prioritizeByImportance"
                      checked={formData.actions.prioritizeByImportance}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        actions: { ...prev.actions, prioritizeByImportance: !!checked }
                      }))}
                    />
                    <Label htmlFor="prioritizeByImportance">Prioritize by importance and urgency</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name}>
            Create Policy
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}


