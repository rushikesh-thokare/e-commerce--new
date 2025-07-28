"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Shield, Truck, Headphones } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  const features = [
    { icon: Shield, text: "Secure Payment" },
    { icon: Truck, text: "Free Shipping" },
    { icon: Headphones, text: "24/7 Support" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-sm font-semibold uppercase tracking-wider">Premium Quality</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Discover</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Amazing Products
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                Shop the latest trends and find everything you need at unbeatable prices. Quality products, fast
                shipping, and excellent customer service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 animate-in fade-in-0 duration-1000"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-in slide-in-from-right-8 duration-1000">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500 border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-gray-600 hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-a0OJDDm4nm4DlereyAUpmFsRFZwI9I.webp"
                    alt="RT Logo - Premium Technology Brand"
                    width={500}
                    height={400}
                    className="rounded-xl w-full h-auto relative z-10 drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse opacity-80"></div>

              {/* Stats Cards */}
              <div className="absolute top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-float">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>

              <div className="absolute bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-float-delayed">
                <div className="text-2xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white dark:fill-gray-900">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  )
}
