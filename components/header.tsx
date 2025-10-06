"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LogIn, UserPlus } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  // Don't show header on auth pages or dashboard pages
  const hideHeader = pathname.startsWith("/auth") || pathname.startsWith("/seller") || pathname.startsWith("/buyer")

  if (hideHeader) {
    return null
  }

  return (
    <header className="bg-background-surface border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary-blue" />
            <span className="text-xl font-bold text-text-primary">VendorX</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/about" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/contact" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button className="btn-primary">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800 py-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/about" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                pathname === "/contact" ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
