"use client"

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Story", href: "#story" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
    ],
    support: [
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#faq" },
      { name: "Live Chat", href: "#chat" },
      { name: "Help Center", href: "#help" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Return Policy", href: "#returns" },
    ],
    categories: [
      { name: "Electronics", href: "#electronics" },
      { name: "Audio", href: "#audio" },
      { name: "Computers", href: "#computers" },
      { name: "Accessories", href: "#accessories" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "Youtube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated with Latest Deals</h3>
            <p className="text-blue-100 mb-8 text-lg">
              Subscribe to our newsletter and get exclusive offers, new product announcements, and special discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 transition-all duration-300"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl font-bold text-xl shadow-lg">
                E
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EliteStore
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Premium Shopping Experience</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your trusted online shopping destination for quality products at unbeatable prices. We're committed to
              providing excellent customer service, fast shipping, and premium products.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>123 Business Street, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>support@elitestore.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${social.color}`}
                  asChild
                >
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-800" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
            &copy; 2024 EliteStore. All rights reserved. Built with ❤️ for amazing customers.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Secure payments powered by</span>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">VISA</div>
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">MC</div>
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
