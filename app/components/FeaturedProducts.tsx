"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart, Eye, Filter, Grid, List, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useAuth } from "../context/AuthContext"
import { useProductDetail } from "../context/ProductDetailContext"
import { toast } from "sonner"
import Image from "next/image"

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
  features: string[]
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gA4x1sYafoRFVNPlsg0nLGiQEThAzZ.png",
    category: "Audio",
    brand: "TechPro",
    rating: 4.8,
    reviews: 128,
    description:
      "High-quality wireless headphones with active noise cancellation, premium sound quality, and 30-hour battery life. Perfect for music lovers and professionals.",
    inStock: true,
    features: ["Active Noise Cancellation", "30-hour Battery", "Premium Sound Quality", "Comfortable Design"],
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300&text=Smart+Fitness+Watch",
    category: "Electronics",
    brand: "FitTech",
    rating: 4.6,
    reviews: 89,
    description:
      "Advanced fitness tracking with heart rate monitor, GPS functionality, and comprehensive health insights. Track your progress and achieve your goals.",
    inStock: true,
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"],
  },
  {
    id: 3,
    name: "Luxury Smartphone Pro",
    price: 1199.99,
    image: "/placeholder.svg?height=300&width=300&text=Luxury+Smartphone+Pro",
    category: "Electronics",
    brand: "PhoneTech",
    rating: 4.9,
    reviews: 234,
    description:
      "Latest flagship smartphone with advanced triple camera system, 5G connectivity, and premium build quality. Experience the future of mobile technology.",
    inStock: true,
    features: ["Triple Camera System", "5G Connectivity", "Premium Build", "All-day Battery"],
  },
  {
    id: 4,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300&text=Gaming+Mechanical+Keyboard",
    category: "Electronics",
    brand: "GamePro",
    rating: 4.7,
    reviews: 167,
    description:
      "RGB backlit mechanical keyboard with customizable keys, tactile switches, and gaming-optimized features. Elevate your gaming experience.",
    inStock: true,
    features: ["RGB Backlighting", "Mechanical Switches", "Customizable Keys", "Gaming Optimized"],
  },
  {
    id: 5,
    name: "Professional Camera",
    price: 899.99,
    originalPrice: 1099.99,
    image: "/placeholder.svg?height=300&width=300&text=Professional+Camera",
    category: "Electronics",
    brand: "PhotoPro",
    rating: 4.5,
    reviews: 94,
    description:
      "Professional DSLR camera with 24MP sensor, 4K video recording, and advanced autofocus system. Capture life's precious moments in stunning detail.",
    inStock: true,
    features: ["24MP Sensor", "4K Video Recording", "Advanced Autofocus", "Professional Grade"],
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300&text=Bluetooth+Speaker",
    category: "Audio",
    brand: "SoundMax",
    rating: 4.3,
    reviews: 203,
    description:
      "Portable Bluetooth speaker with deep bass, crystal clear sound, and 12-hour battery life. Perfect for parties, travel, and outdoor adventures.",
    inStock: false,
    features: ["Deep Bass", "12-hour Battery", "Waterproof", "Portable Design"],
  },
  {
    id: 7,
    name: "Laptop Pro 15-inch",
    price: 1499.99,
    image: "/placeholder.svg?height=300&width=300&text=Laptop+Pro+15-inch",
    category: "Computers",
    brand: "CompuTech",
    rating: 4.8,
    reviews: 156,
    description:
      "High-performance laptop with Intel i7 processor, 16GB RAM, and dedicated graphics. Perfect for professionals, creators, and power users.",
    inStock: true,
    features: ["Intel i7 Processor", "16GB RAM", "Dedicated Graphics", "15-inch Display"],
  },
  {
    id: 8,
    name: "Wireless Gaming Mouse",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=300&width=300&text=Wireless+Gaming+Mouse",
    category: "Electronics",
    brand: "TechPro",
    rating: 4.4,
    reviews: 312,
    description:
      "Ergonomic wireless gaming mouse with precision tracking, customizable buttons, and RGB lighting. Designed for competitive gaming and long sessions.",
    inStock: true,
    features: ["Precision Tracking", "Customizable Buttons", "RGB Lighting", "Ergonomic Design"],
  },
]

export default function FeaturedProducts() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const { user, toggleLogin } = useAuth()
  const { openProductDetail } = useProductDetail()

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toggleLogin()
      toast.error("Please login to add items to cart")
      return
    }
    addToCart(product)
    toast.success(`${product.name} added to cart!`, {
      description: `$${product.price} • ${product.brand}`,
    })
  }

  const handleToggleWishlist = (productId: number) => {
    if (!user) {
      toggleLogin()
      toast.error("Please login to add items to wishlist")
      return
    }
    const product = products.find((p) => p.id === productId)
    toggleWishlist(productId)
    const isInWishlist = wishlist.includes(productId)
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist", {
      description: product?.name,
    })
  }

  const handleViewProduct = (product: Product) => {
    openProductDetail(product)
  }

  const filterProducts = (category: string, sort: string) => {
    const filtered = category === "all" ? products : products.filter((p) => p.category === category)

    switch (sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(category, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterProducts(selectedCategory, sort)
  }

  return (
    <section id="shop" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-sm font-semibold uppercase tracking-wider">Featured Collection</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Premium Products</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at unbeatable prices
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 ${
                viewMode === "list" ? "flex-row" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
                {/* Product Image */}
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      viewMode === "list" ? "h-full" : "h-48"
                    }`}
                  />

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 animate-pulse">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2 font-semibold">
                        Out of Stock
                      </Badge>
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => handleToggleWishlist(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors duration-300 ${
                          wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  {/* Category & Brand */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</span>
                  </div>

                  {/* Product Name */}
                  <h3
                    className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                    onClick={() => handleViewProduct(product)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Description (List view only) */}
                  {viewMode === "list" && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-bold text-2xl text-gray-900 dark:text-white">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSortBy("featured")
                filterProducts("all", "featured")
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* View All Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
