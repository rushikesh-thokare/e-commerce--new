import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Email service configuration (using a simple email service)
    const emailData = {
      to: "your-email@gmail.com", // आपका email address
      subject: `New User Data - ${userData.type}`,
      html: `
        <h2>New User Data Received</h2>
        <p><strong>Type:</strong> ${userData.type}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>IP Address:</strong> ${request.headers.get("x-forwarded-for") || "unknown"}</p>
        
        <h3>User Details:</h3>
        <pre>${JSON.stringify(userData.data, null, 2)}</pre>
        
        <hr>
        <p>This data was collected from your EliteStore website.</p>
      `,
    }

    // You can use services like EmailJS, Resend, or SendGrid
    // For now, we'll log it (you can integrate with your preferred email service)
    console.log("User data to be emailed:", emailData)

    return NextResponse.json({ success: true, message: "Data logged for email" })
  } catch (error) {
    console.error("Error processing user data:", error)
    return NextResponse.json({ error: "Failed to process data" }, { status: 500 })
  }
}
