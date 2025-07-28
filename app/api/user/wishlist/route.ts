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

    return NextResponse.json({ wishlist: user.wishlist || [] })
  } catch (error) {
    console.error("Get wishlist error:", error)
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

    const { productId, action } = await request.json()

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    if (action === "add") {
      await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        {
          $addToSet: { wishlist: productId },
          $set: { updatedAt: new Date() },
        },
      )
    } else if (action === "remove") {
      await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        {
          $pull: { wishlist: productId },
          $set: { updatedAt: new Date() },
        },
      )
    }

    return NextResponse.json({ message: `Product ${action}ed to/from wishlist` })
  } catch (error) {
    console.error("Wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
