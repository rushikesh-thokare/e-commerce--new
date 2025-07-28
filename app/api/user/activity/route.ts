import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

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

    const { action, details } = await request.json()

    const db = await getDatabase()
    const activitiesCollection = db.collection("user_activities")

    await activitiesCollection.insertOne({
      userId: decoded.userId,
      action,
      details,
      timestamp: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({ message: "Activity logged successfully" })
  } catch (error) {
    console.error("Activity logging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const activitiesCollection = db.collection("user_activities")

    const activities = await activitiesCollection
      .find({ userId: decoded.userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
