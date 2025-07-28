import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ cart: user.cart || [] })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { productId, name, price, image, quantity = 1 } = await request.json()

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const cartItem = {
      productId,
      name,
      price,
      image,
      quantity,
      addedAt: new Date(),
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $push: { cart: cartItem },
        $set: { updatedAt: new Date() },
      },
    )

    // Log activity
    const activitiesCollection = db.collection("user_activities")
    await activitiesCollection.insertOne({
      userId: decoded.userId,
      action: "add_to_cart",
      details: { productId, name, price, quantity },
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "Item added to cart", cartItem })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { cart } = await request.json()

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          cart: cart,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Cart updated successfully" })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
