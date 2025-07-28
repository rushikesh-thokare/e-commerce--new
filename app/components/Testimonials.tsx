"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Customer",
    image: "/placeholder.svg?height=80&width=80&text=SJ",
    rating: 5,
    comment:
      "Amazing quality products and fast shipping! I've been shopping here for months and never been disappointed. The customer service is exceptional.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Enthusiast",
    image: "/placeholder.svg?height=80&width=80&text=MC",
    rating: 5,
    comment:
      "Best place to find the latest tech gadgets at competitive prices. The product descriptions are accurate and delivery is always on time.",
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Fashion Lover",
    image: "/placeholder.svg?height=80&width=80&text=ED",
    rating: 5,
    comment:
      "Love the variety of products available! From electronics to accessories, everything is high quality. The website is easy to navigate too.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-500 mr-2" />
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">"{testimonial.comment}"</p>

                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
