// Vercel Postgres Database
import { sql } from "@vercel/postgres"

// Initialize database tables
export async function initializeTables() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        avatar_url TEXT,
        phone VARCHAR(50),
        address JSONB,
        preferences JSONB DEFAULT '{"theme": "light", "notifications": true, "newsletter": false}',
        cart JSONB DEFAULT '[]',
        wishlist JSONB DEFAULT '[]',
        search_history JSONB DEFAULT '[]',
        view_history JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        role VARCHAR(20) DEFAULT 'user'
      );
    `

    // Create user_activities table
    await sql`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_email VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_id VARCHAR(100) UNIQUE NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address JSONB,
        payment_method VARCHAR(100),
        payment_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_user_id ON user_activities(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON user_activities(timestamp);`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`

    console.log("Database tables initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// User operations
export async function createUser(userData: {
  name: string
  email: string
  passwordHash?: string
  preferences?: any
}) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password_hash, preferences, created_at, updated_at, last_login)
      VALUES (${userData.name}, ${userData.email}, ${userData.passwordHash || ""}, ${JSON.stringify(
        userData.preferences || {},
      )}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, email, preferences, created_at;
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, name, email, preferences, cart, wishlist, created_at, last_login, is_active, role
      FROM users 
      WHERE email = ${email} AND is_active = true;
    `
    return result.rows[0] || null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export async function updateUserLastLogin(email: string) {
  try {
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email};
    `
    return true
  } catch (error) {
    console.error("Error updating last login:", error)
    throw error
  }
}

export async function updateUserCart(email: string, cart: any[]) {
  try {
    await sql`
      UPDATE users 
      SET cart = ${JSON.stringify(cart)}, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email};
    `
    return true
  } catch (error) {
    console.error("Error updating cart:", error)
    throw error
  }
}

export async function updateUserWishlist(email: string, wishlist: string[]) {
  try {
    await sql`
      UPDATE users 
      SET wishlist = ${JSON.stringify(wishlist)}, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email};
    `
    return true
  } catch (error) {
    console.error("Error updating wishlist:", error)
    throw error
  }
}

// Activity logging
export async function logUserActivity(activity: {
  userId?: number
  userEmail?: string
  action: string
  details?: any
  ipAddress?: string
  userAgent?: string
}) {
  try {
    await sql`
      INSERT INTO user_activities (user_id, user_email, action, details, ip_address, user_agent, timestamp)
      VALUES (${activity.userId || null}, ${activity.userEmail || ""}, ${activity.action}, ${JSON.stringify(
        activity.details || {},
      )}, ${activity.ipAddress || ""}, ${activity.userAgent || ""}, CURRENT_TIMESTAMP);
    `
    return true
  } catch (error) {
    console.error("Error logging activity:", error)
    throw error
  }
}

// Analytics queries
export async function getUserStats() {
  try {
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true;`
    const newUsersToday = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE DATE(created_at) = CURRENT_DATE AND is_active = true;
    `
    const activeUsersToday = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE DATE(last_login) = CURRENT_DATE AND is_active = true;
    `

    return {
      totalUsers: Number.parseInt(totalUsers.rows[0].count),
      newUsersToday: Number.parseInt(newUsersToday.rows[0].count),
      activeUsersToday: Number.parseInt(activeUsersToday.rows[0].count),
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    throw error
  }
}

export async function getRecentActivities(limit = 50) {
  try {
    const result = await sql`
      SELECT ua.*, u.name as user_name
      FROM user_activities ua
      LEFT JOIN users u ON ua.user_id = u.id
      ORDER BY ua.timestamp DESC
      LIMIT ${limit};
    `
    return result.rows
  } catch (error) {
    console.error("Error getting recent activities:", error)
    throw error
  }
}
