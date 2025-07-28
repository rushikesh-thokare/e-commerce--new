import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Send data to your local webhook or external service
    const webhookUrl = process.env.WEBHOOK_URL || "https://your-local-server.com/webhook"

    const payload = {
      timestamp: new Date().toISOString(),
      type: userData.type,
      data: userData.data,
      metadata: {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        referer: request.headers.get("referer") || "unknown",
      },
    }

    // Send to your webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Data sent to webhook" })
    } else {
      throw new Error("Webhook failed")
    }
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Failed to send data" }, { status: 500 })
  }
}
