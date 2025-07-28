import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Google Sheets API integration
    // You'll need to set up Google Sheets API credentials
    const GOOGLE_SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append`

    const row = [
      new Date().toISOString(),
      userData.type,
      userData.data.name || "",
      userData.data.email || "",
      userData.data.action || "",
      JSON.stringify(userData.data),
      request.headers.get("x-forwarded-for") || "unknown",
    ]

    const response = await fetch(`${GOOGLE_SHEETS_URL}?valueInputOption=RAW&key=${process.env.GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [row],
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Data saved to Google Sheets" })
    } else {
      throw new Error("Failed to save to Google Sheets")
    }
  } catch (error) {
    console.error("Error saving to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
