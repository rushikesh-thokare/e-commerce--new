"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface WishlistContextType {
  wishlist: number[]
  isWishlistOpen: boolean
  toggleWishlist: (productId: number) => void
  removeFromWishlist: (productId: number) => void
  clearWishlist: () => void
  toggleWishlistModal: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error)
        localStorage.removeItem("wishlist")
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const toggleWishlistItem = (productId: number) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId)
      } else {
        return [...prevWishlist, productId]
      }
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== productId))
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const toggleWishlistModal = () => {
    setIsWishlistOpen(!isWishlistOpen)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistOpen,
        toggleWishlist: toggleWishlistItem,
        removeFromWishlist,
        clearWishlist,
        toggleWishlistModal,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
