"use client"

import { Heart, ShoppingCart, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"
import Image from "next/image"

// Sample products data (in real app, this would come from a context or API)
const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Wireless+Headphones",
    category: "Audio",
    brand: "TechPro",
    rating: 4.8,
    reviews: 128,
    description: "High-quality wireless headphones with active noise cancellation.",
    inStock: true,
    features: ["Active Noise Cancellation", "30-hour Battery", "Premium Sound Quality"],
  },
  // Add more products as needed
]

export default function WishlistModal() {
  const { wishlist, isWishlistOpen, toggleWishlistModal, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user, toggleLogin } = useAuth()

  const wishlistProducts = sampleProducts.filter((product) => wishlist.includes(product.id))

  const handleAddToCart = (product: any) => {
    if (!user) {
      toggleLogin()
      toast.error("Please login to add items to cart")
      return
    }
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
  }

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId)
    const product = sampleProducts.find((p) => p.id === productId)
    toast.success("Removed from wishlist", {
      description: product?.name,
    })
  }

  const handleClearWishlist = () => {
    clearWishlist()
    toast.success("Wishlist cleared")
  }

  return (
    <Dialog open={isWishlistOpen} onOpenChange={toggleWishlistModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              <span>My Wishlist</span>
              <span className="text-sm text-gray-500">({wishlist.length} items)</span>
            </div>
            {wishlist.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearWishlist}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Save items you love for later by clicking the heart icon.
              </p>
              <Button
                onClick={toggleWishlistModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-in fade-in-0 slide-in-from-left-4"
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {product.brand} • {product.category}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-xl text-gray-900 dark:text-white">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
