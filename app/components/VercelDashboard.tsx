"use client"

import { useState, useEffect } from "react"
import { Database, Users, Activity, TrendingUp, Eye, Search, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Analytics {
  users: {
    totalUsers: number
    newUsersToday: number
    activeUsersToday: number
  }
  today: {
    pageViews: number
    searches: number
    cartAdds: number
  }
  recentActivities: Array<{
    id: number
    user_name: string
    action: string
    details: any
    timestamp: string
  }>
}

export default function VercelDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/vercel-db/analytics?type=overview")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        throw new Error("Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("Failed to load analytics")
    } finally {
      setIsLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/vercel-db/init", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Database initialized successfully!")
        fetchAnalytics()
      } else {
        throw new Error("Failed to initialize database")
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      toast.error("Failed to initialize database")
    } finally {
      setIsInitializing(false)
    }
  }

  const trackTestEvent = async (action: string, data: any) => {
    try {
      const response = await fetch("/api/vercel-db/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      })

      if (response.ok) {
        toast.success(`${action} tracked successfully!`)
        fetchAnalytics()
      } else {
        throw new Error("Failed to track event")
      }
    } catch (error) {
      console.error("Error tracking event:", error)
      toast.error("Failed to track event")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Database className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading Vercel Database Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            Vercel Database Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time analytics powered by Vercel Postgres & KV</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={initializeDatabase} disabled={isInitializing} variant="outline">
            {isInitializing ? "Initializing..." : "Initialize DB"}
          </Button>
          <Button onClick={fetchAnalytics} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>

      {analytics ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{analytics.users.newUsersToday} today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.users.activeUsersToday}</div>
                <p className="text-xs text-muted-foreground">Users active today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.today.pageViews}</div>
                <p className="text-xs text-muted-foreground">Views today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cart Adds</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.today.cartAdds}</div>
                <p className="text-xs text-muted-foreground">Items added today</p>
              </CardContent>
            </Card>
          </div>

          {/* Test Events */}
          <Card>
            <CardHeader>
              <CardTitle>Test Event Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    trackTestEvent("page_view", {
                      page: "dashboard",
                      url: "/dashboard",
                    })
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Track Page View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    trackTestEvent("search", {
                      query: "test product",
                      results: 5,
                    })
                  }
                >
                  <Search className="h-4 w-4 mr-2" />
                  Track Search
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    trackTestEvent("cart_add", {
                      productId: "test-123",
                      productName: "Test Product",
                      price: 99.99,
                      quantity: 1,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Track Cart Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent User Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivities.length > 0 ? (
                  analytics.recentActivities.slice(0, 10).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{activity.action}</Badge>
                        <span className="font-medium">{activity.user_name || "Anonymous"}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.details && typeof activity.details === "object"
                            ? Object.keys(activity.details).length > 0
                              ? JSON.stringify(activity.details).slice(0, 50) + "..."
                              : "No details"
                            : "No details"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No recent activities</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Database Not Initialized</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the "Initialize DB" button to set up your Vercel database tables.
            </p>
            <Button onClick={initializeDatabase} disabled={isInitializing}>
              {isInitializing ? "Initializing..." : "Initialize Database"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
