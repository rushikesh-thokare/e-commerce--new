"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

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
  features?: string[]
}

interface ProductDetailContextType {
  selectedProduct: Product | null
  isOpen: boolean
  openProductDetail: (product: Product) => void
  closeProductDetail: () => void
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined)

export function ProductDetailProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setIsOpen(true)
  }

  const closeProductDetail = () => {
    setIsOpen(false)
    // Delay clearing the product to allow for exit animation
    setTimeout(() => setSelectedProduct(null), 300)
  }

  return (
    <ProductDetailContext.Provider
      value={{
        selectedProduct,
        isOpen,
        openProductDetail,
        closeProductDetail,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  )
}

export function useProductDetail() {
  const context = useContext(ProductDetailContext)
  if (context === undefined) {
    throw new Error("useProductDetail must be used within a ProductDetailProvider")
  }
  return context
}
