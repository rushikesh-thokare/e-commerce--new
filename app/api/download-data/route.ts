import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // This endpoint allows you to download collected data
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    // In a real implementation, you'd fetch this from your storage
    const sampleData = {
      users: [
        {
          name: "John Doe",
          email: "john@example.com",
          registeredAt: "2024-01-15T10:30:00Z",
          lastActive: "2024-01-20T15:45:00Z",
        },
      ],
      activities: [
        {
          userId: "user123",
          action: "product_view",
          productId: "prod456",
          timestamp: "2024-01-20T15:45:00Z",
        },
      ],
    }

    const csvData = convertToCSV(sampleData[type] || sampleData)

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="user-data-${type}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to generate download" }, { status: 500 })
  }
}

function convertToCSV(data: any[]): string {
  if (!data.length) return ""

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" ? `"${value}"` : value
        })
        .join(","),
    ),
  ]

  return csvRows.join("\n")
}
