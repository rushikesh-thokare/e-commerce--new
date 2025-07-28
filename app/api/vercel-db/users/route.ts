import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, updateUserLastLogin, logUserActivity } from "@/lib/vercel-postgres"
import { setUserSession } from "@/lib/vercel-kv"

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    if (action === "register") {
      const { name, email } = data

      // Check if user already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
      }

      // Create new user
      const newUser = await createUser({
        name,
        email,
        preferences: {
          theme: "light",
          notifications: true,
          newsletter: false,
        },
      })

      // Log registration activity
      await logUserActivity({
        userId: newUser.id,
        userEmail: email,
        action: "register",
        details: { name, email },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      })

      // Create session
      const sessionId = `${newUser.id}_${Date.now()}`
      await setUserSession(sessionId, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      })

      const response = NextResponse.json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          preferences: newUser.preferences,
        },
      })

      // Set session cookie
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400 * 7, // 7 days
      })

      return response
    }

    if (action === "login") {
      const { email } = data

      const user = await getUserByEmail(email)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Update last login
      await updateUserLastLogin(email)

      // Log login activity
      await logUserActivity({
        userId: user.id,
        userEmail: email,
        action: "login",
        details: { email },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      })

      // Create session
      const sessionId = `${user.id}_${Date.now()}`
      await setUserSession(sessionId, {
        id: user.id,
        name: user.name,
        email: user.email,
      })

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          cart: user.cart,
          wishlist: user.wishlist,
        },
      })

      // Set session cookie
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400 * 7, // 7 days
      })

      return response
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
