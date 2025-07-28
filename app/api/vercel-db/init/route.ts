import { type NextRequest, NextResponse } from "next/server"
import { initializeTables } from "@/lib/vercel-postgres"

export async function POST(request: NextRequest) {
  try {
    await initializeTables()
    return NextResponse.json({
      success: true,
      message: "Database tables initialized successfully",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
