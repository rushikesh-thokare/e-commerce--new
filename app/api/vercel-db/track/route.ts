import { type NextRequest, NextResponse } from "next/server"
import { getUserSession, incrementCounter, addToSearchHistory, trackProductView } from "@/lib/vercel-kv"
import { logUserActivity } from "@/lib/vercel-postgres"

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()
    const sessionId = request.cookies.get("session_id")?.value
    const session = sessionId ? await getUserSession(sessionId) : null
    const today = new Date().toISOString().split("T")[0]

    switch (action) {
      case "page_view":
        await incrementCounter(`page_views:${today}`)
        if (session) {
          await logUserActivity({
            userId: session.id,
            userEmail: session.email,
            action: "page_view",
            details: { page: data.page, url: data.url },
          })
        }
        break

      case "search":
        await incrementCounter(`searches:${today}`)
        if (session) {
          await addToSearchHistory(session.id.toString(), data.query)
          await logUserActivity({
            userId: session.id,
            userEmail: session.email,
            action: "search",
            details: { query: data.query, results: data.results },
          })
        }
        break

      case "product_view":
        if (session) {
          await trackProductView(session.id.toString(), data.productId, data.productName)
          await logUserActivity({
            userId: session.id,
            userEmail: session.email,
            action: "product_view",
            details: {
              productId: data.productId,
              productName: data.productName,
              category: data.category,
            },
          })
        }
        break

      case "cart_add":
        await incrementCounter(`cart_adds:${today}`)
        if (session) {
          await logUserActivity({
            userId: session.id,
            userEmail: session.email,
            action: "add_to_cart",
            details: {
              productId: data.productId,
              productName: data.productName,
              price: data.price,
              quantity: data.quantity,
            },
          })
        }
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Event tracked successfully" })
  } catch (error) {
    console.error("Tracking API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
