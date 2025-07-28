// Vercel KV (Redis) for fast data access
import { kv } from "@vercel/kv"

// Session management
export async function setUserSession(sessionId: string, userData: any, expirationSeconds = 86400) {
  try {
    await kv.setex(`session:${sessionId}`, expirationSeconds, JSON.stringify(userData))
    return true
  } catch (error) {
    console.error("Error setting session:", error)
    throw error
  }
}

export async function getUserSession(sessionId: string) {
  try {
    const session = await kv.get(`session:${sessionId}`)
    return session ? JSON.parse(session as string) : null
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function deleteUserSession(sessionId: string) {
  try {
    await kv.del(`session:${sessionId}`)
    return true
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}

// Cart management (fast access)
export async function setUserCart(userId: string, cart: any[]) {
  try {
    await kv.setex(`cart:${userId}`, 86400 * 7, JSON.stringify(cart)) // 7 days expiration
    return true
  } catch (error) {
    console.error("Error setting cart:", error)
    throw error
  }
}

export async function getUserCart(userId: string) {
  try {
    const cart = await kv.get(`cart:${userId}`)
    return cart ? JSON.parse(cart as string) : []
  } catch (error) {
    console.error("Error getting cart:", error)
    return []
  }
}

// Wishlist management
export async function setUserWishlist(userId: string, wishlist: string[]) {
  try {
    await kv.setex(`wishlist:${userId}`, 86400 * 30, JSON.stringify(wishlist)) // 30 days expiration
    return true
  } catch (error) {
    console.error("Error setting wishlist:", error)
    throw error
  }
}

export async function getUserWishlist(userId: string) {
  try {
    const wishlist = await kv.get(`wishlist:${userId}`)
    return wishlist ? JSON.parse(wishlist as string) : []
  } catch (error) {
    console.error("Error getting wishlist:", error)
    return []
  }
}

// Search history and analytics
export async function addToSearchHistory(userId: string, searchQuery: string) {
  try {
    const key = `search_history:${userId}`
    const existing = await kv.get(key)
    const history = existing ? JSON.parse(existing as string) : []

    // Add new search with timestamp
    history.unshift({
      query: searchQuery,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 50 searches
    const limitedHistory = history.slice(0, 50)

    await kv.setex(key, 86400 * 30, JSON.stringify(limitedHistory)) // 30 days
    return true
  } catch (error) {
    console.error("Error adding to search history:", error)
    throw error
  }
}

export async function getUserSearchHistory(userId: string) {
  try {
    const history = await kv.get(`search_history:${userId}`)
    return history ? JSON.parse(history as string) : []
  } catch (error) {
    console.error("Error getting search history:", error)
    return []
  }
}

// Product view tracking
export async function trackProductView(userId: string, productId: string, productName: string) {
  try {
    const key = `view_history:${userId}`
    const existing = await kv.get(key)
    const history = existing ? JSON.parse(existing as string) : []

    // Add new view
    history.unshift({
      productId,
      productName,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 100 views
    const limitedHistory = history.slice(0, 100)

    await kv.setex(key, 86400 * 30, JSON.stringify(limitedHistory)) // 30 days
    return true
  } catch (error) {
    console.error("Error tracking product view:", error)
    throw error
  }
}

// Real-time analytics
export async function incrementCounter(key: string, expiration = 86400) {
  try {
    const current = await kv.incr(key)
    if (current === 1) {
      await kv.expire(key, expiration)
    }
    return current
  } catch (error) {
    console.error("Error incrementing counter:", error)
    return 0
  }
}

export async function getCounter(key: string) {
  try {
    const count = await kv.get(key)
    return count ? Number.parseInt(count as string) : 0
  } catch (error) {
    console.error("Error getting counter:", error)
    return 0
  }
}

// Popular products tracking
export async function trackPopularProduct(productId: string) {
  try {
    const today = new Date().toISOString().split("T")[0]
    const key = `popular:${today}:${productId}`
    await incrementCounter(key, 86400) // 24 hours
    return true
  } catch (error) {
    console.error("Error tracking popular product:", error)
    throw error
  }
}
