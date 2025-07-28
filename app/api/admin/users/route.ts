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

    // Check if user is admin
    const adminUser = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get all users (excluding passwords)
    const users = await usersCollection
      .find(
        {},
        {
          projection: {
            password: 0,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray()

    // Get user statistics
    const totalUsers = await usersCollection.countDocuments()
    const activeUsers = await usersCollection.countDocuments({ isActive: true })
    const newUsersToday = await usersCollection.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    })

    return NextResponse.json({
      users,
      statistics: {
        totalUsers,
        activeUsers,
        newUsersToday,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
