import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, Shield, Zap, Target, Heart, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-blue to-secondary-blue py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About VendorX</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're building the future of e-commerce by connecting passionate vendors with discerning buyers in a
            trusted, innovative marketplace.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-6">Our Mission</h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto">
            To create a seamless, secure, and empowering marketplace where entrepreneurs can thrive and customers can
            discover unique products from vendors around the world.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-primary-blue mx-auto mb-4" />
              <CardTitle className="text-text-primary">Trust & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary text-center">
                We prioritize the safety and security of all transactions, ensuring a trusted environment for both
                buyers and vendors.
              </p>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-success mx-auto mb-4" />
              <CardTitle className="text-text-primary">Community First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary text-center">
                Our platform is built around fostering meaningful connections between vendors and buyers, creating a
                vibrant community.
              </p>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 text-accent-blue mx-auto mb-4" />
              <CardTitle className="text-text-primary">Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary text-center">
                We continuously evolve our platform with cutting-edge technology to provide the best user experience
                possible.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-text-primary mb-6">Our Story</h3>
            <div className="space-y-4 text-text-secondary">
              <p>
                Founded in 2024, VendorX was born from a simple idea: what if we could create a platform that truly
                empowers both vendors and buyers?
              </p>
              <p>
                We noticed that existing marketplaces often favored one side over the other. Vendors struggled with high
                fees and complex processes, while buyers faced limited choices and poor customer service.
              </p>
              <p>
                That's when we decided to build VendorX - a marketplace that puts community, trust, and user experience
                at the center of everything we do.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-blue/20 to-accent-blue/20 rounded-lg p-8 border border-gray-800">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-blue mb-2">1000+</div>
                <div className="text-text-secondary">Active Vendors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-2">5000+</div>
                <div className="text-text-secondary">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-blue mb-2">10K+</div>
                <div className="text-text-secondary">Products Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-blue mb-2">99.9%</div>
                <div className="text-text-secondary">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-6">Why Choose VendorX?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-10 w-10 text-primary-blue mx-auto mb-4" />
              <h4 className="font-semibold text-text-primary mb-2">Focused Experience</h4>
              <p className="text-text-secondary text-sm">Tailored dashboards for vendors and buyers</p>
            </div>
            <div className="text-center">
              <Heart className="h-10 w-10 text-success mx-auto mb-4" />
              <h4 className="font-semibold text-text-primary mb-2">Customer Care</h4>
              <p className="text-text-secondary text-sm">24/7 support for all your needs</p>
            </div>
            <div className="text-center">
              <Award className="h-10 w-10 text-accent-blue mx-auto mb-4" />
              <h4 className="font-semibold text-text-primary mb-2">Quality Assured</h4>
              <p className="text-text-secondary text-sm">Verified vendors and quality products</p>
            </div>
            <div className="text-center">
              <ShoppingBag className="h-10 w-10 text-secondary-blue mx-auto mb-4" />
              <h4 className="font-semibold text-text-primary mb-2">Easy Shopping</h4>
              <p className="text-text-secondary text-sm">Simple, intuitive buying process</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center card-dark rounded-lg p-8 glow-effect">
          <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Join Our Community?</h3>
          <p className="text-text-secondary mb-6">
            Whether you're looking to sell your products or discover amazing deals, VendorX is here to help you succeed.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/auth/signup?role=seller" className="btn-secondary px-8 py-3 rounded-lg">
              Start Selling
            </a>
            <a href="/auth/signup?role=buyer" className="btn-primary px-8 py-3 rounded-lg">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
