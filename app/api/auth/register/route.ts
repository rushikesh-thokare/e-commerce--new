import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser: Omit<User, "_id"> = {
      name,
      email,
      password: hashedPassword,
      cart: [],
      wishlist: [],
      orders: [],
      searchHistory: [],
      viewHistory: [],
      preferences: {
        theme: "light",
        notifications: true,
        newsletter: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      role: "user",
    }

    const result = await usersCollection.insertOne(newUser)
    const userId = result.insertedId.toString()

    // Generate JWT token
    const token = generateToken(userId)

    // Log user activity
    const activitiesCollection = db.collection("user_activities")
    await activitiesCollection.insertOne({
      userId,
      action: "register",
      details: { email, name },
      timestamp: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Return user data (without password)
    const userResponse = {
      _id: userId,
      name,
      email,
      preferences: newUser.preferences,
      createdAt: newUser.createdAt,
    }

    const response = NextResponse.json({
      message: "User registered successfully",
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
