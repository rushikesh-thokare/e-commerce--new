import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "user-data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Save user registration data
    if (userData.type === "registration") {
      const registrationFile = path.join(dataDir, "registrations.json")
      const timestamp = new Date().toISOString()

      const userRecord = {
        ...userData.data,
        timestamp,
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      }

      // Read existing data or create new array
      let existingData = []
      try {
        const fileContent = await import(registrationFile)
        existingData = fileContent.default || []
      } catch {
        existingData = []
      }

      existingData.push(userRecord)

      await writeFile(registrationFile, JSON.stringify(existingData, null, 2))
    }

    // Save user activity data
    if (userData.type === "activity") {
      const activityFile = path.join(dataDir, "user-activities.json")
      const timestamp = new Date().toISOString()

      const activityRecord = {
        ...userData.data,
        timestamp,
        ip: request.headers.get("x-forwarded-for") || "unknown",
      }

      let existingActivities = []
      try {
        const fileContent = await import(activityFile)
        existingActivities = fileContent.default || []
      } catch {
        existingActivities = []
      }

      existingActivities.push(activityRecord)

      await writeFile(activityFile, JSON.stringify(existingActivities, null, 2))
    }

    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("Error saving user data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
