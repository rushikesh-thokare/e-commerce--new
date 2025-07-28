export interface User {
  _id?: string
  name: string
  email: string
  password: string
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences?: {
    theme: "light" | "dark"
    notifications: boolean
    newsletter: boolean
  }
  cart: CartItem[]
  wishlist: string[]
  orders: Order[]
  searchHistory: string[]
  viewHistory: ProductView[]
  createdAt: Date
  updatedAt: Date
  lastLogin: Date
  isActive: boolean
  role: "user" | "admin"
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  addedAt: Date
}

export interface Order {
  _id?: string
  orderId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

export interface ProductView {
  productId: string
  productName: string
  viewedAt: Date
  duration?: number
}

export interface UserActivity {
  _id?: string
  userId: string
  action: "login" | "logout" | "view_product" | "add_to_cart" | "purchase" | "search"
  details: any
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}
