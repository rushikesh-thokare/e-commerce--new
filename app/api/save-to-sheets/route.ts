// Google Sheets - Completely Free
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Google Apps Script Web App URL (you'll create this)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addUser",
        data: {
          timestamp: new Date().toISOString(),
          name: userData.name,
          email: userData.email,
          type: userData.type || "registration",
          details: JSON.stringify(userData.details || {}),
          ip: request.headers.get("x-forwarded-for") || "unknown",
        },
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Data saved to Google Sheets" })
    } else {
      throw new Error("Failed to save to Google Sheets")
    }
  } catch (error) {
    console.error("Google Sheets error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
