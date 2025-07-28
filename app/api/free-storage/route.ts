// Universal API for all free storage options
import { type NextRequest, NextResponse } from "next/server"
import { saveUserData } from "@/lib/supabase"
import { JSONBinStorage } from "@/lib/jsonbin"
import { AirtableStorage } from "@/lib/airtable"

export async function POST(request: NextRequest) {
  try {
    const { provider, type, data } = await request.json()

    const userData = {
      ...data,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    let result

    switch (provider) {
      case "supabase":
        if (type === "user") {
          result = await saveUserData(userData)
        }
        break

      case "jsonbin":
        const jsonbin = new JSONBinStorage()
        if (type === "user") {
          result = await jsonbin.addUser(userData)
        } else if (type === "activity") {
          result = await jsonbin.addActivity(userData)
        }
        break

      case "airtable":
        const airtable = new AirtableStorage()
        if (type === "user") {
          result = await airtable.saveUser(userData)
        } else if (type === "activity") {
          result = await airtable.saveActivity(userData)
        }
        break

      case "sheets":
        // Call Google Sheets API
        const sheetsResponse = await fetch(`${process.env.GOOGLE_SCRIPT_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addUser", data: userData }),
        })
        result = await sheetsResponse.json()
        break

      default:
        throw new Error("Invalid storage provider")
    }

    return NextResponse.json({
      success: true,
      message: `Data saved to ${provider}`,
      result,
    })
  } catch (error) {
    console.error(`Storage error:`, error)
    return NextResponse.json(
      {
        error: "Failed to save data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
