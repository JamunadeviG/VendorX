import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Store, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-text-primary mb-6 bg-gradient-to-r from-primary-blue to-accent-blue bg-clip-text text-transparent">
            VendorX Marketplace
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Connect buyers and vendors in one powerful platform. Sell your products or discover amazing deals from
            multiple vendors in our sleek, modern marketplace.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="btn-primary text-lg px-8 py-3 animate-glow">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="btn-secondary text-lg px-8 py-3">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <Store className="h-10 w-10 text-primary-blue mb-2" />
              <CardTitle className="text-text-primary">Multi-Vendor Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-secondary">
                Multiple vendors can list and manage their products independently on VendorX
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <ShoppingBag className="h-10 w-10 text-success mb-2" />
              <CardTitle className="text-text-primary">Easy Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-secondary">
                Buyers can browse all products, add to cart, and make purchase requests seamlessly
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <Users className="h-10 w-10 text-secondary-blue mb-2" />
              <CardTitle className="text-text-primary">Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-secondary">
                Separate dashboards and features for vendors and buyers on VendorX
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <Zap className="h-10 w-10 text-accent-blue mb-2" />
              <CardTitle className="text-text-primary">Real-Time Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-secondary">
                Instant buy request notifications with buyer location and details
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center card-dark rounded-lg p-8 glow-effect">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Start?</h2>
          <p className="text-text-secondary mb-6">Choose your role and join our VendorX community</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup?role=seller">
              <Button className="btn-secondary px-8 py-3">I'm a Vendor</Button>
            </Link>
            <Link href="/auth/signup?role=buyer">
              <Button className="btn-primary px-8 py-3">I'm a Buyer</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
