// MongoDB Database Setup Script
// Run this in MongoDB Compass or MongoDB Shell

// Declare variables
const use = (dbName) => db.getSiblingDB(dbName)
const db = use("elitestore")

// Create users collection with indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: 1 })
db.users.createIndex({ lastLogin: 1 })
db.users.createIndex({ role: 1 })

// Create user_activities collection with indexes
db.user_activities.createIndex({ userId: 1 })
db.user_activities.createIndex({ timestamp: 1 })
db.user_activities.createIndex({ action: 1 })

// Create products collection with indexes
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ category: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: 1 })

// Create orders collection with indexes
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ orderId: 1 }, { unique: true })
db.orders.createIndex({ createdAt: 1 })
db.orders.createIndex({ status: 1 })

// Insert sample admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@elitestore.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1JG", // password: admin123
  role: "admin",
  cart: [],
  wishlist: [],
  orders: [],
  searchHistory: [],
  viewHistory: [],
  preferences: {
    theme: "light",
    notifications: true,
    newsletter: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  isActive: true,
})

console.log("MongoDB setup completed successfully!")
console.log("Admin user created with email: admin@elitestore.com and password: admin123")
