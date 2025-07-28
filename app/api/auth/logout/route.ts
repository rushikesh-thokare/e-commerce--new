import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        // Log user activity
        const db = await getDatabase()
        const activitiesCollection = db.collection("user_activities")
        await activitiesCollection.insertOne({
          userId: decoded.userId,
          action: "logout",
          details: {},
          timestamp: new Date(),
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        })
      }
    }

    const response = NextResponse.json({ message: "Logout successful" })

    // Clear the auth cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
