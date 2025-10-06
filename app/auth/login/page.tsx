"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Store } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main px-4">
      <Card className="w-full max-w-2xl card-dark glow-effect">
        <CardHeader>
          <CardTitle className="text-text-primary text-2xl">Choose account type</CardTitle>
          <CardDescription className="text-text-secondary">
            Sign in as a buyer or a vendor (farmer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/auth/login/buyer" className="group">
              <div className="p-6 border border-gray-800 rounded-lg bg-background-main hover:border-accent-blue/40 transition-colors h-full">
                <div className="flex items-center mb-3 text-primary-blue">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="font-medium">Buyer</span>
                </div>
                <p className="text-text-secondary mb-4">Browse products and manage your cart.</p>
                <Button className="btn-primary w-full">Sign in as Buyer</Button>
              </div>
            </Link>
            <Link href="/auth/login/vendor" className="group">
              <div className="p-6 border border-gray-800 rounded-lg bg-background-main hover:border-accent-blue/40 transition-colors h-full">
                <div className="flex items-center mb-3 text-accent-blue">
                  <Store className="h-5 w-5 mr-2" />
                  <span className="font-medium">Vendor (Farmer)</span>
                </div>
                <p className="text-text-secondary mb-4">Post and manage your product listings.</p>
                <Button className="btn-secondary w-full">Sign in as Vendor</Button>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
