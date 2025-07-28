"use client"

import { useState } from "react"
import { Download, Database, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { DataLogger } from "@/lib/dataLogger"

export default function DataExporter() {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadData = async (type: string) => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/download-data?type=${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `user-data-${type}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Data downloaded successfully!")
      } else {
        throw new Error("Download failed")
      }
    } catch (error) {
      toast.error("Failed to download data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportLocalData = () => {
    const dataLogger = DataLogger.getInstance()
    const localData = dataLogger.exportLocalData()

    const blob = new Blob([localData], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `local-user-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.success("Local data exported!")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          User Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => handleDownloadData("users")}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download User Data
          </Button>

          <Button
            onClick={() => handleDownloadData("activities")}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Download Activities
          </Button>

          <Button onClick={handleExportLocalData} variant="secondary" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Export Local Data
          </Button>

          <Button
            onClick={() => toast.info("Email integration coming soon!")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email Reports
          </Button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Available Options:</h4>
          <ul className="space-y-1">
            <li>
              • <strong>File Storage:</strong> Save data as JSON/CSV files
            </li>
            <li>
              • <strong>Email Reports:</strong> Get user data via email
            </li>
            <li>
              • <strong>Google Sheets:</strong> Automatic spreadsheet updates
            </li>
            <li>
              • <strong>Webhook:</strong> Send data to your local server
            </li>
            <li>
              • <strong>Local Export:</strong> Download browser-stored data
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
