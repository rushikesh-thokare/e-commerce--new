// Airtable - Free tier (1,200 records per base)
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

export class AirtableStorage {
  private apiKey: string
  private baseId: string
  private baseUrl: string

  constructor() {
    this.apiKey = AIRTABLE_API_KEY!
    this.baseId = AIRTABLE_BASE_ID!
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`
  }

  async saveUser(userData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/Users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name: userData.name,
            Email: userData.email,
            "Created At": new Date().toISOString(),
            "User Agent": userData.userAgent || "",
            "IP Address": userData.ip || "",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save user to Airtable")
      }

      return await response.json()
    } catch (error) {
      console.error("Airtable save user error:", error)
      throw error
    }
  }

  async saveActivity(activity: any) {
    try {
      const response = await fetch(`${this.baseUrl}/Activities`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "User Email": activity.userEmail,
            Action: activity.action,
            Details: JSON.stringify(activity.details),
            Timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save activity to Airtable")
      }

      return await response.json()
    } catch (error) {
      console.error("Airtable save activity error:", error)
      throw error
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/Users`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get users from Airtable")
      }

      const data = await response.json()
      return data.records
    } catch (error) {
      console.error("Airtable get users error:", error)
      throw error
    }
  }
}
