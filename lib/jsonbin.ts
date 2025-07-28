// JSONBin.io - Free JSON storage (100 requests/minute)
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID

export class JSONBinStorage {
  private apiKey: string
  private binId: string

  constructor() {
    this.apiKey = JSONBIN_API_KEY!
    this.binId = JSONBIN_BIN_ID!
  }

  async saveData(data: any) {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": this.apiKey,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save data")
      }

      return await response.json()
    } catch (error) {
      console.error("JSONBin save error:", error)
      throw error
    }
  }

  async getData() {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
        headers: {
          "X-Master-Key": this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get data")
      }

      const result = await response.json()
      return result.record
    } catch (error) {
      console.error("JSONBin get error:", error)
      throw error
    }
  }

  async addUser(userData: any) {
    try {
      const existingData = await this.getData()
      const users = existingData.users || []

      users.push({
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })

      await this.saveData({ ...existingData, users })
      return true
    } catch (error) {
      console.error("Add user error:", error)
      return false
    }
  }

  async addActivity(activity: any) {
    try {
      const existingData = await this.getData()
      const activities = existingData.activities || []

      activities.push({
        ...activity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      })

      await this.saveData({ ...existingData, activities })
      return true
    } catch (error) {
      console.error("Add activity error:", error)
      return false
    }
  }
}
