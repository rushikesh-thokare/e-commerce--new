"use client"

import { useState } from "react"
import { X, Star, Heart, ShoppingCart, Minus, Plus, Share2, Shield, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProductDetail } from "../context/ProductDetailContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"
import Image from "next/image"

export default function ProductDetailModal() {
  const [quantity, setQuantity] = useState(1)
  const { selectedProduct, isOpen, closeProductDetail } = useProductDetail()
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const { user, toggleLogin } = useAuth()

  if (!selectedProduct) return null

  const handleAddToCart = () => {
    if (!user) {
      toggleLogin()
      toast.error("Please login to add items to cart")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct)
    }

    toast.success(`${selectedProduct.name} added to cart!`, {
      description: `Quantity: ${quantity} • $${(selectedProduct.price * quantity).toFixed(2)}`,
    })
  }

  const handleToggleWishlist = () => {
    if (!user) {
      toggleLogin()
      toast.error("Please login to add items to wishlist")
      return
    }
    toggleWishlist(selectedProduct.id)
    const isInWishlist = wishlist.includes(selectedProduct.id)
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist", { description: selectedProduct.name })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Product link copied to clipboard!")
    }
  }

  const features = [
    { icon: Shield, text: "2 Year Warranty" },
    { icon: Truck, text: "Free Shipping" },
    { icon: RotateCcw, text: "30-Day Returns" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={closeProductDetail}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {/* Product Image */}
          <div className="relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8">
            <Image
              src={selectedProduct.image || "/placeholder.svg"}
              alt={selectedProduct.name}
              width={500}
              height={500}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />

            {/* Discount Badge */}
            {selectedProduct.originalPrice && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white font-semibold px-3 py-1">
                {Math.round(
                  ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100,
                )}
                % OFF
              </Badge>
            )}

            {/* Share Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="flex flex-col h-full">
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {selectedProduct.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{selectedProduct.brand}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedProduct.name}</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={closeProductDetail} className="flex-shrink-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {selectedProduct.inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-12 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleToggleWishlist} className="h-12 px-4 border-2 bg-transparent">
                  <Heart
                    className={`h-5 w-5 ${
                      wishlist.includes(selectedProduct.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <feature.icon className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Product Details Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedProduct.description}</p>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  <ul className="space-y-2">
                    {selectedProduct.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4">
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Reviews coming soon! Be the first to review this product.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
