import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EliteStore - Premium E-commerce Experience",
  description:
    "Discover amazing products at unbeatable prices. Modern, responsive design with dark mode support, professional shopping experience.",
  keywords: "ecommerce, online shopping, electronics, audio, computers, accessories, premium products",
  authors: [{ name: "EliteStore Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "EliteStore - Premium E-commerce Experience",
    description: "Discover amazing products at unbeatable prices",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteStore - Premium E-commerce Experience",
    description: "Discover amazing products at unbeatable prices",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
