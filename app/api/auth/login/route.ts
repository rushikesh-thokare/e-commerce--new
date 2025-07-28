import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { comparePassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models/User"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Find user by email
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    // Generate JWT token
    const token = generateToken(user._id!.toString())

    // Log user activity
    const activitiesCollection = db.collection("user_activities")
    await activitiesCollection.insertOne({
      userId: user._id!.toString(),
      action: "login",
      details: { email },
      timestamp: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Return user data (without password)
    const userResponse = {
      _id: user._id!.toString(),
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      cart: user.cart,
      wishlist: user.wishlist,
      createdAt: user.createdAt,
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
