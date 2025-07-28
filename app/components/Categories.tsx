"use client"

import { ShoppingBag, Headphones, Laptop, Smartphone, Camera, Watch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: Smartphone,
    count: 150,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Audio",
    icon: Headphones,
    count: 85,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    name: "Computers",
    icon: Laptop,
    count: 120,
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    name: "Cameras",
    icon: Camera,
    count: 65,
    color: "from-red-500 to-red-600",
  },
  {
    id: 5,
    name: "Accessories",
    icon: Watch,
    count: 200,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 6,
    name: "All Products",
    icon: ShoppingBag,
    count: 620,
    color: "from-gray-500 to-gray-600",
  },
]

export default function Categories() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800 animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} products</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
