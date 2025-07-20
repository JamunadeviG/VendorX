import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Package, Search, Heart } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import AddToCartButton from "@/components/add-to-cart-button"

async function getBuyerData(buyerId: string) {
  const supabase = createServerClient()

  // Get all products
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      seller:users!products_seller_id_fkey(name, location)
    `)
    .gt("stock_count", 0)
    .order("created_at", { ascending: false })
    .limit(8)

  // Get cart items count
  const { count: cartCount } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", buyerId)

  // Get buy requests count
  const { count: buyRequestsCount } = await supabase
    .from("buy_requests")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", buyerId)

  return {
    products: products || [],
    cartCount: cartCount || 0,
    buyRequestsCount: buyRequestsCount || 0,
  }
}

export default async function BuyerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const decoded = await verifyToken(token)
  if (!decoded || decoded.role !== "buyer") {
    redirect("/auth/login")
  }

  const buyerData = await getBuyerData(decoded.userId)

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-primary">Marketplace</h1>
          <div className="flex items-center space-x-4">
            <Link href="/buyer/cart">
              <Button className="btn-secondary">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({buyerData.cartCount})
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Available Products</CardTitle>
              <Package className="h-4 w-4 text-primary-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{buyerData.products.length}+</div>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{buyerData.cartCount}</div>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Purchase Requests</CardTitle>
              <Heart className="h-4 w-4 text-accent-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{buyerData.buyRequestsCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Featured Products</h2>
          <div className="flex space-x-2">
            <Link href="/buyer/products">
              <Button className="btn-secondary">
                <Search className="mr-2 h-4 w-4" />
                Browse All
              </Button>
            </Link>
            <Link href="/buyer/cart">
              <Button className="btn-primary">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {buyerData.products.length === 0 ? (
          <Card className="card-dark">
            <CardContent className="text-center py-12">
              <p className="text-text-secondary mb-4">No products available at the moment</p>
              <Button className="btn-secondary">Check back later</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerData.products.map((product: any) => (
              <Card key={product.id} className="card-dark hover:glow-effect transition-all duration-300 group">
                <CardHeader className="p-0">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1 text-text-primary">{product.title}</CardTitle>
                  <CardDescription className="mb-3 line-clamp-2 text-text-secondary">
                    {product.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-success">${product.price}</span>
                    <span className="text-sm text-text-secondary">Stock: {product.stock_count}</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">
                    Sold by {product.seller?.name} from {product.seller?.location}
                  </p>
                  <AddToCartButton productId={product.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
