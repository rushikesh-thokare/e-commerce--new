import { type NextRequest, NextResponse } from "next/server"
import { getUserStats, getRecentActivities } from "@/lib/vercel-postgres"
import { getCounter } from "@/lib/vercel-kv"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "overview"

    if (type === "overview") {
      const userStats = await getUserStats()
      const today = new Date().toISOString().split("T")[0]

      const analytics = {
        users: userStats,
        today: {
          pageViews: await getCounter(`page_views:${today}`),
          searches: await getCounter(`searches:${today}`),
          cartAdds: await getCounter(`cart_adds:${today}`),
        },
        recentActivities: await getRecentActivities(20),
      }

      return NextResponse.json(analytics)
    }

    if (type === "activities") {
      const activities = await getRecentActivities(100)
      return NextResponse.json({ activities })
    }

    return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
