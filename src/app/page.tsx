import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react";

export default function Dashboard() {
  // Mock data
  const todayStats = [
    { category: "金融类", newItems: 3, insights: 2, trend: "up" },
    { category: "生物AI", newItems: 5, insights: 3, trend: "up" },
    { category: "行业情报", newItems: 2, insights: 1, trend: "down" },
  ];

  const recentActivity = [
    { time: "09:00", source: "bioRxiv", action: "新论文发布", item: "蛋白质结构预测新突破" },
    { time: "10:30", source: "GitHub", action: "新 commit", item: "torvalds: Linux 内核更新" },
    { time: "11:15", source: "金融", action: "融资新闻", item: "AI 金融科技公司获 5000 万美元融资" },
    { time: "12:00", source: "行业", action: "政策发布", item: "央行数字货币试点扩大" },
  ];

  const anomalies = [
    { type: "warning", message: "GitHub API 限流 (3/5 sources)", count: 3 },
    { type: "success", message: "金融类今日增量 +200%", count: 200 },
    { type: "info", message: "生物AI 新论文数量创新高", count: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Today's Highlights</h1>
        <p className="text-muted-foreground">Overview of today's news intelligence</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {todayStats.map((stat) => (
          <Card key={stat.category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.category}</CardTitle>
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.newItems} 新文</div>
              <p className="text-xs text-muted-foreground">
                {stat.insights} 个洞见
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {activity.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.source}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{activity.action}:</span> {activity.item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anomalies & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Anomalies & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    {anomaly.type === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {anomaly.type === "success" && (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    {anomaly.type === "info" && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm">{anomaly.message}</span>
                  </div>
                  <Badge variant="secondary">{anomaly.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">View All Sources</Button>
            <Button variant="outline">Generate Daily Digest</Button>
            <Button variant="outline">Search Recent News</Button>
            <Button variant="outline">Manage Policies</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}