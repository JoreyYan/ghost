"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Search, ChevronRight, ChevronDown, Settings, FolderOpen, Folder } from "lucide-react"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"

// Mock data for categories tree
const mockCategories = [
  {
    id: "1",
    name: "金融类",
    description: "金融、投资、加密货币相关新闻",
    sourceCount: 12,
    defaultPolicy: "Finance Policy v1.2",
    children: [
      {
        id: "1-1",
        name: "加密货币",
        description: "比特币、以太坊等数字货币",
        sourceCount: 5,
        defaultPolicy: "Crypto Policy v2.0",
        children: []
      },
      {
        id: "1-2", 
        name: "传统金融",
        description: "银行、保险、证券等传统金融",
        sourceCount: 7,
        defaultPolicy: "Finance Policy v1.2",
        children: []
      }
    ]
  },
  {
    id: "2",
    name: "生物AI",
    description: "生物信息学、人工智能在生物领域的应用",
    sourceCount: 8,
    defaultPolicy: "BioAI Policy v1.5",
    children: [
      {
        id: "2-1",
        name: "机器学习",
        description: "ML算法在生物数据中的应用",
        sourceCount: 4,
        defaultPolicy: "ML Policy v1.0",
        children: []
      },
      {
        id: "2-2",
        name: "生物信息",
        description: "基因组学、蛋白质组学等",
        sourceCount: 4,
        defaultPolicy: "BioInfo Policy v2.1",
        children: []
      }
    ]
  },
  {
    id: "3",
    name: "行业情报",
    description: "各行业动态、政策、趋势分析",
    sourceCount: 3,
    defaultPolicy: "Industry Policy v1.0",
    children: []
  }
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1", "2"])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredCategories = mockCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CategoryNode = ({ category, level = 0 }: { category: any, level?: number }) => {
    const isExpanded = expandedCategories.includes(category.id)
    const hasChildren = category.children && category.children.length > 0

    return (
      <div className="space-y-1">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                {hasChildren ? (
                  isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4" />
                )}
                {level === 0 ? (
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 text-gray-500" />
                )}
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category.sourceCount} sources</Badge>
                <Badge variant="outline" className="text-xs">
                  {category.defaultPolicy}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>
          
          {hasChildren && (
            <CollapsibleContent>
              <div className="ml-7 space-y-1">
                {category.children.map((child: any) => (
                  <CategoryNode key={child.id} category={child} level={level + 1} />
                ))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Organize your data sources into hierarchical categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <AddCategoryDialog onClose={() => setIsAddDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CategoryNode key={category.id} category={category} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No categories found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Assign Sources to Categories</Button>
            <Button variant="outline">Bulk Update Policies</Button>
            <Button variant="outline">Export Category Structure</Button>
            <Button variant="outline">Import Categories</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


