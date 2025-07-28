"use client"

import type React from "react"

import { useTheme } from "../context/ThemeContext"

interface ThemeWrapperProps {
  children: React.ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { mounted } = useTheme()

  // Show a loading state until theme is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Loading Header */}
        <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl font-bold text-xl shadow-lg">
                  E
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EliteStore
                  </h1>
                  <p className="text-xs text-gray-500">Premium Shopping</p>
                </div>
              </div>

              {/* Loading placeholders */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Loading content */}
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading EliteStore...</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
