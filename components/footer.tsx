"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Don't show footer on auth pages or dashboard pages
  const hideFooter = pathname.startsWith("/auth") || pathname.startsWith("/seller") || pathname.startsWith("/buyer")

  if (hideFooter) {
    return null
  }

  return (
    <footer className="bg-background-surface border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-primary-blue" />
              <span className="text-lg font-bold text-text-primary">VendorX</span>
            </Link>
            <p className="text-text-secondary text-sm">
              Your trusted multi-seller marketplace connecting buyers and sellers worldwide. Discover amazing products
              from verified vendors on VendorX.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Home
              </Link>
              <Link
                href="/about"
                className="block text-text-secondary hover:text-primary-blue transition-colors text-sm"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-text-secondary hover:text-primary-blue transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/auth/signup?role=seller"
                className="block text-text-secondary hover:text-primary-blue transition-colors text-sm"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Help Center
              </a>
              <a href="#" className="block text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="block text-text-secondary hover:text-primary-blue transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent-blue" />
                <span className="text-text-secondary text-sm">support@vendorx.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent-blue" />
                <span className="text-text-secondary text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent-blue" />
                <span className="text-text-secondary text-sm">123 Vendor St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">© {new Date().getFullYear()} VendorX. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-blue transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
