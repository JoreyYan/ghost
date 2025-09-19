"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TrendingUp, Users, FileText, AlertCircle, CheckCircle } from "lucide-react"

// Mock data for dashboard
const mockSummaries = [
  {
    id: "1",
    title: "AI Research Breakthrough",
    source: "bioRxiv",
    category: "Bio-AI",
    summary: "New protein folding model achieves 95% accuracy on benchmark dataset",
    impact: "high",
    timestamp: "2 hours ago"
  },
  {
    id: "2", 
    title: "Cryptocurrency Market Update",
    source: "CoinDesk",
    category: "Financial",
    summary: "Bitcoin reaches new all-time high amid institutional adoption",
    impact: "medium",
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    title: "Open Source Release",
    source: "GitHub",
    category: "Technology", 
    summary: "Major framework update with performance improvements",
    impact: "medium",
    timestamp: "6 hours ago"
  }
]

const mockActivity = [
  { time: "09:30", event: "New source added: TechCrunch RSS", type: "source" },
  { time: "08:45", event: "Daily digest generated for Bio-AI category", type: "digest" },
  { time: "08:15", event: "3 new items fetched from bioRxiv", type: "fetch" },
  { time: "07:30", event: "Analysis policy updated for Financial category", type: "policy" }
]

const mockAlerts = [
  { id: "1", type: "warning", message: "CoinDesk source failed to fetch", time: "1 hour ago" },
  { id: "2", type: "info", message: "New category created: Industry", time: "2 hours ago" },
  { id: "3", type: "success", message: "Daily digest completed successfully", time: "3 hours ago" }
]

export default function DashboardPage() {
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>
      case "medium":
        return <Badge variant="default">Medium Impact</Badge>
      case "low":
        return <Badge variant="outline">Low Impact</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Today&apos;s Highlights</h1>
        <p className="text-muted-foreground">Overview of today&apos;s news intelligence</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockSummaries.map((summary) => (
          <Card key={summary.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{summary.title}</CardTitle>
                {getImpactBadge(summary.impact)}
              </div>
              <CardDescription>
                {summary.source} • {summary.category} • {summary.timestamp}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium">{activity.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg border">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Today&apos;s Digest
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Sources
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Manage Policies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
