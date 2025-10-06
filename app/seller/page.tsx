import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingCart, Plus, BarChart3 } from "lucide-react"
import LogoutButton from "@/components/logout-button"

async function getSellerData(sellerId: string) {
  const db = await getDb()

  const productsCount = await db.collection("products").countDocuments({ seller_id: sellerId })
  const buyRequestsCount = await db.collection("buy_requests").countDocuments({ seller_id: sellerId })

  const recentRequests = await db
    .collection("buy_requests")
    .aggregate([
      { $match: { seller_id: sellerId } },
      { $sort: { created_at: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "buyer_id",
          foreignField: "id",
          as: "buyer",
        },
      },
      { $addFields: { buyer: { $arrayElemAt: ["$buyer", 0] } } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "id",
          as: "product",
        },
      },
      { $addFields: { product: { $arrayElemAt: ["$product", 0] } } },
      { $project: { "buyer.password_hash": 0 } },
    ])
    .toArray()

  return {
    productsCount: productsCount || 0,
    buyRequestsCount: buyRequestsCount || 0,
    recentRequests: recentRequests || [],
  }
}

export default async function SellerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const decoded = await verifyToken(token)
  if (!decoded || decoded.role !== "seller") {
    redirect("/auth/login")
  }

  const sellerData = await getSellerData(decoded.userId)

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-primary">Seller Dashboard</h1>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total Products</CardTitle>
              <Package className="h-4 w-4 text-primary-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{sellerData.productsCount}</div>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Buy Requests</CardTitle>
              <ShoppingCart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{sellerData.buyRequestsCount}</div>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">$0</div>
              <p className="text-xs text-text-secondary">No payment processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-text-primary">Product Management</CardTitle>
              <CardDescription className="text-text-secondary">
                Manage your product listings and inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/seller/products/new">
                <Button className="w-full btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
              <Link href="/seller/products">
                <Button className="w-full btn-secondary">View All Products</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-dark hover:glow-effect transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-text-primary">Buy Requests</CardTitle>
              <CardDescription className="text-text-secondary">
                View and manage customer purchase requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/seller/requests">
                <Button className="w-full btn-secondary">View All Requests</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Buy Requests */}
        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-text-primary">Recent Buy Requests</CardTitle>
            <CardDescription className="text-text-secondary">Latest purchase requests from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {sellerData.recentRequests.length === 0 ? (
              <p className="text-text-secondary text-center py-4">No buy requests yet</p>
            ) : (
              <div className="space-y-4">
                {sellerData.recentRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-4 border border-gray-800 rounded-lg bg-background-main hover:border-accent-blue/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{request.product?.title}</p>
                      <p className="text-sm text-text-secondary">
                        {request.buyer?.name} from {request.buyer?.location}
                      </p>
                      <p className="text-xs text-text-secondary">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">${request.product?.price}</p>
                      <p className="text-sm text-text-secondary">Qty: {request.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
