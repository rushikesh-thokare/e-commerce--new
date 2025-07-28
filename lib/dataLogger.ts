// Client-side data logging utility
export class DataLogger {
  private static instance: DataLogger
  private queue: any[] = []
  private isOnline = true

  static getInstance(): DataLogger {
    if (!DataLogger.instance) {
      DataLogger.instance = new DataLogger()
    }
    return DataLogger.instance
  }

  constructor() {
    // Check online status
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine
      window.addEventListener("online", () => {
        this.isOnline = true
        this.flushQueue()
      })
      window.addEventListener("offline", () => {
        this.isOnline = false
      })
    }
  }

  async logUserData(type: string, data: any) {
    const logEntry = {
      type,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
    }

    if (this.isOnline) {
      try {
        await this.sendToServer(logEntry)
      } catch (error) {
        console.error("Failed to send data:", error)
        this.queue.push(logEntry)
        this.saveToLocalStorage(logEntry)
      }
    } else {
      this.queue.push(logEntry)
      this.saveToLocalStorage(logEntry)
    }
  }

  private async sendToServer(data: any) {
    const response = await fetch("/api/save-user-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Server error")
    }
  }

  private saveToLocalStorage(data: any) {
    try {
      const existing = JSON.parse(localStorage.getItem("userDataQueue") || "[]")
      existing.push(data)
      localStorage.setItem("userDataQueue", JSON.stringify(existing))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  private async flushQueue() {
    while (this.queue.length > 0) {
      const data = this.queue.shift()
      try {
        await this.sendToServer(data)
      } catch (error) {
        this.queue.unshift(data) // Put it back
        break
      }
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2)
      sessionStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }

  // Export data for download
  exportLocalData(): string {
    const data = localStorage.getItem("userDataQueue") || "[]"
    return data
  }
}
