"use client"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import FeaturedProducts from "./components/FeaturedProducts"
import Footer from "./components/Footer"
import CartModal from "./components/CartModal"
import WishlistModal from "./components/WishlistModal"
import LoginModal from "./components/LoginModal"
import ProductDetailModal from "./components/ProductDetailModal"
import ThemeWrapper from "./components/ThemeWrapper"
import { ThemeProvider } from "./context/ThemeContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { AuthProvider } from "./context/AuthContext"
import { ProductDetailProvider } from "./context/ProductDetailContext"
import { Toaster } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviews: number
  description: string
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface AppUser {
  name: string
  email: string
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/images/headphones.png",
    category: "Audio",
    brand: "TechPro",
    rating: 4.8,
    reviews: 128,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    inStock: true,
  },
  {
    id: 2,
    name: "Luxury Smartphone Pro",
    price: 1199.99,
    image: "/images/smartphone.png",
    category: "Electronics",
    brand: "PhoneTech",
    rating: 4.9,
    reviews: 89,
    description: "Latest flagship smartphone with advanced camera and 5G connectivity.",
    inStock: true,
  },
  {
    id: 3,
    name: "Professional Laptop Elite",
    price: 2499.99,
    image: "/images/laptop.png",
    category: "Computers",
    brand: "CompuTech",
    rating: 4.7,
    reviews: 156,
    description: "High-performance laptop for professionals with latest processor and graphics.",
    inStock: true,
  },
  {
    id: 4,
    name: "Luxury Swiss Watch",
    price: 899.99,
    originalPrice: 1299.99,
    image: "/images/watch.png",
    category: "Accessories",
    brand: "TimeElite",
    rating: 4.9,
    reviews: 67,
    description: "Premium Swiss-made watch with automatic movement and sapphire crystal.",
    inStock: true,
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    image: "/images/keyboard.png",
    category: "Electronics",
    brand: "GamePro",
    rating: 4.6,
    reviews: 234,
    description: "RGB backlit mechanical keyboard with customizable keys for gaming.",
    inStock: true,
  },
  {
    id: 6,
    name: "Wireless Bluetooth Speaker",
    price: 79.99,
    originalPrice: 119.99,
    image: "/images/speaker.png",
    category: "Audio",
    brand: "SoundMax",
    rating: 4.4,
    reviews: 189,
    description: "Portable Bluetooth speaker with deep bass and 12-hour battery life.",
    inStock: true,
  },
  {
    id: 7,
    name: "4K Ultra HD Smart TV",
    price: 799.99,
    originalPrice: 999.99,
    image: "/images/tv.png",
    category: "Electronics",
    brand: "VisionTech",
    rating: 4.5,
    reviews: 145,
    description: "55-inch 4K Smart TV with HDR support and built-in streaming apps.",
    inStock: true,
  },
  {
    id: 8,
    name: "Fitness Tracker Pro",
    price: 199.99,
    originalPrice: 249.99,
    image: "/images/fitness-tracker.png",
    category: "Accessories",
    brand: "FitTech",
    rating: 4.3,
    reviews: 312,
    description: "Advanced fitness tracking with heart rate monitor and GPS functionality.",
    inStock: true,
  },
  {
    id: 9,
    name: "Leather Executive Briefcase",
    price: 299.99,
    image: "/images/briefcase.png",
    category: "Accessories",
    brand: "LeatherCraft",
    rating: 4.7,
    reviews: 98,
    description: "Premium leather briefcase perfect for business professionals.",
    inStock: true,
  },
  {
    id: 10,
    name: "Wireless Gaming Mouse",
    price: 89.99,
    originalPrice: 129.99,
    image: "/images/gaming-mouse.png",
    category: "Electronics",
    brand: "GamePro",
    rating: 4.6,
    reviews: 267,
    description: "High-precision wireless gaming mouse with customizable RGB lighting.",
    inStock: true,
  },
  {
    id: 11,
    name: "Premium Coffee Maker",
    price: 249.99,
    originalPrice: 329.99,
    image: "/images/coffee-maker.png",
    category: "Home",
    brand: "BrewMaster",
    rating: 4.4,
    reviews: 156,
    description: "Automatic coffee maker with built-in grinder and programmable settings.",
    inStock: true,
  },
  {
    id: 12,
    name: "Wireless Earbuds Pro",
    price: 179.99,
    originalPrice: 229.99,
    image: "/images/earbuds.png",
    category: "Audio",
    brand: "AudioTech",
    rating: 4.5,
    reviews: 423,
    description: "True wireless earbuds with active noise cancellation and long battery life.",
    inStock: true,
  },
  {
    id: 13,
    name: "Smart Home Security Camera",
    price: 129.99,
    image: "/images/security-camera.png",
    category: "Electronics",
    brand: "SecureTech",
    rating: 4.2,
    reviews: 189,
    description: "1080p HD security camera with night vision and mobile app control.",
    inStock: true,
  },
  {
    id: 14,
    name: "Designer Sunglasses",
    price: 199.99,
    originalPrice: 299.99,
    image: "/images/sunglasses.png",
    category: "Accessories",
    brand: "StyleVision",
    rating: 4.6,
    reviews: 134,
    description: "Premium designer sunglasses with UV protection and polarized lenses.",
    inStock: true,
  },
  {
    id: 15,
    name: "Tablet Pro 12-inch",
    price: 699.99,
    originalPrice: 799.99,
    image: "/images/tablet.png",
    category: "Computers",
    brand: "TabletTech",
    rating: 4.4,
    reviews: 278,
    description: "12-inch tablet with high-resolution display and stylus support.",
    inStock: true,
  },
  {
    id: 16,
    name: "Air Purifier HEPA",
    price: 299.99,
    image: "/images/air-purifier.png",
    category: "Home",
    brand: "CleanAir",
    rating: 4.3,
    reviews: 167,
    description: "HEPA air purifier with smart sensors and app control for clean air.",
    inStock: true,
  },
  {
    id: 17,
    name: "Wireless Charging Pad",
    price: 39.99,
    originalPrice: 59.99,
    image: "/images/charging-pad.png",
    category: "Electronics",
    brand: "ChargeTech",
    rating: 4.1,
    reviews: 345,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    inStock: true,
  },
  {
    id: 18,
    name: "Premium Backpack",
    price: 89.99,
    originalPrice: 119.99,
    image: "/images/backpack.png",
    category: "Accessories",
    brand: "TravelPro",
    rating: 4.5,
    reviews: 234,
    description: "Water-resistant backpack with laptop compartment and USB charging port.",
    inStock: true,
  },
  {
    id: 19,
    name: "Smart Doorbell Camera",
    price: 199.99,
    image: "/images/doorbell-camera.png",
    category: "Electronics",
    brand: "HomeTech",
    rating: 4.4,
    reviews: 198,
    description: "Smart doorbell with HD video, two-way audio, and motion detection.",
    inStock: true,
  },
  {
    id: 20,
    name: "Portable Power Bank",
    price: 49.99,
    originalPrice: 69.99,
    image: "/images/power-bank.png",
    category: "Electronics",
    brand: "PowerTech",
    rating: 4.2,
    reviews: 456,
    description: "20,000mAh portable power bank with fast charging and multiple ports.",
    inStock: true,
  },
]

export default function HomePage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ProductDetailProvider>
              <ThemeWrapper>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      },
                    }}
                  />
                  <Header />
                  <main>
                    <HeroSection />
                    <FeaturedProducts />
                  </main>
                  <Footer />

                  {/* Modals */}
                  <CartModal />
                  <WishlistModal />
                  <LoginModal />
                  <ProductDetailModal />
                </div>
              </ThemeWrapper>
            </ProductDetailProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
