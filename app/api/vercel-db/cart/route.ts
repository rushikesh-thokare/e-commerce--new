import { type NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/lib/vercel-kv"
import { updateUserCart, logUserActivity } from "@/lib/vercel-postgres"

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = await getUserSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { action, cart, item } = await request.json()

    if (action === "update") {
      // Update entire cart
      await updateUserCart(session.email, cart)

      // Log activity
      await logUserActivity({
        userId: session.id,
        userEmail: session.email,
        action: "update_cart",
        details: { itemCount: cart.length },
      })

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully",
      })
    }

    if (action === "add") {
      // Add single item to cart
      await logUserActivity({
        userId: session.id,
        userEmail: session.email,
        action: "add_to_cart",
        details: {
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Item added to cart",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
