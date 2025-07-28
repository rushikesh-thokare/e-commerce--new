"use client"

import { useState } from "react"
import { Database, Cloud, FileText, Table, Sheet, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const storageOptions = [
  {
    id: "supabase",
    name: "Supabase",
    icon: Database,
    description: "PostgreSQL database with 500MB free storage",
    limits: "500MB storage, 2GB bandwidth",
    setup: "Easy setup with SQL database",
    color: "bg-green-500",
  },
  {
    id: "firebase",
    name: "Firebase Firestore",
    icon: Cloud,
    description: "NoSQL document database by Google",
    limits: "1GB storage, 50K reads/day",
    setup: "Real-time database with offline support",
    color: "bg-orange-500",
  },
  {
    id: "jsonbin",
    name: "JSONBin.io",
    icon: FileText,
    description: "Simple JSON storage service",
    limits: "100 requests/minute, unlimited storage",
    setup: "Instant setup, no configuration needed",
    color: "bg-blue-500",
  },
  {
    id: "airtable",
    name: "Airtable",
    icon: Table,
    description: "Spreadsheet-database hybrid",
    limits: "1,200 records per base",
    setup: "Visual interface, easy to manage",
    color: "bg-purple-500",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    icon: Sheet,
    description: "Use Google Sheets as database",
    limits: "Unlimited (Google Drive limits)",
    setup: "Completely free, familiar interface",
    color: "bg-green-600",
  },
]

export default function FreeStorageSetup() {
  const [selectedProvider, setSelectedProvider] = useState("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const testConnection = async (provider: string) => {
    setIsTestingConnection(true)
    try {
      const response = await fetch("/api/free-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          type: "user",
          data: {
            name: "Test User",
            email: "test@example.com",
            action: "connection_test",
          },
        }),
      })

      if (response.ok) {
        toast.success(`${provider} connection successful!`)
      } else {
        throw new Error("Connection failed")
      }
    } catch (error) {
      toast.error(`${provider} connection failed`)
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">🆓 Free Data Storage Options</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose a free storage solution for your user data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storageOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedProvider === option.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedProvider(option.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${option.color} text-white`}>
                  <option.icon className="h-5 w-5" />
                </div>
                {option.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>

              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {option.limits}
                </Badge>
                <p className="text-xs text-gray-500">{option.setup}</p>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  testConnection(option.id)
                }}
                disabled={isTestingConnection}
                className="w-full"
                size="sm"
              >
                {isTestingConnection ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProvider && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Instructions for {storageOptions.find((o) => o.id === selectedProvider)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProvider === "supabase" && (
                <div>
                  <h4 className="font-semibold mb-2">Supabase Setup:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Go to{" "}
                      <a href="https://supabase.com" className="text-blue-600">
                        supabase.com
                      </a>{" "}
                      and create account
                    </li>
                    <li>Create new project</li>
                    <li>Copy Project URL and API Key</li>
                    <li>Add to environment variables</li>
                  </ol>
                </div>
              )}

              {selectedProvider === "firebase" && (
                <div>
                  <h4 className="font-semibold mb-2">Firebase Setup:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Go to{" "}
                      <a href="https://console.firebase.google.com" className="text-blue-600">
                        Firebase Console
                      </a>
                    </li>
                    <li>Create new project</li>
                    <li>Enable Firestore Database</li>
                    <li>Copy config and add to environment variables</li>
                  </ol>
                </div>
              )}

              {selectedProvider === "jsonbin" && (
                <div>
                  <h4 className="font-semibold mb-2">JSONBin Setup:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Go to{" "}
                      <a href="https://jsonbin.io" className="text-blue-600">
                        jsonbin.io
                      </a>
                    </li>
                    <li>Create account and get API key</li>
                    <li>Create a new bin</li>
                    <li>Copy Bin ID and API key</li>
                  </ol>
                </div>
              )}

              {selectedProvider === "sheets" && (
                <div>
                  <h4 className="font-semibold mb-2">Google Sheets Setup:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Create Google Sheet</li>
                    <li>
                      Go to{" "}
                      <a href="https://script.google.com" className="text-blue-600">
                        script.google.com
                      </a>
                    </li>
                    <li>Create new Apps Script project</li>
                    <li>Paste the provided code</li>
                    <li>Deploy as web app</li>
                  </ol>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
