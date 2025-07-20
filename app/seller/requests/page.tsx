import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Clock, User, ArrowLeft, ShoppingBag } from "lucide-react"
import LogoutButton from "@/components/logout-button"

async function getBuyRequests(sellerId: string) {
  const supabase = createServerClient()

  const { data: buyRequests, error } = await supabase
    .from("buy_requests")
    .select(`
      *,
      buyer:users!buy_requests_buyer_id_fkey(name, email, location),
      product:products(title, price, image_url)
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching buy requests:", error)
    return []
  }

  return buyRequests || []
}

export default async function SellerRequestsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const decoded = await verifyToken(token)
  if (!decoded || decoded.role !== "seller") {
    redirect("/auth/login")
  }

  const buyRequests = await getBuyRequests(decoded.userId)

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/seller" className="text-primary-blue hover:text-secondary-blue transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <ShoppingBag className="h-6 w-6 text-accent-blue" />
            <h1 className="text-2xl font-bold text-text-primary">Buy Requests</h1>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-text-secondary">{buyRequests.length} buy requests found</p>
        </div>

        {buyRequests.length === 0 ? (
          <Card className="card-dark">
            <CardContent className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-accent-blue mb-4" />
              <p className="text-text-secondary mb-4">No buy requests yet</p>
              <p className="text-sm text-text-secondary">
                When customers click "Buy Now" on your products, they'll appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {buyRequests.map((request: any) => (
              <Card key={request.id} className="card-dark hover:glow-effect transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-text-primary">{request.product?.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2 text-text-secondary">
                        <span className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {request.buyer?.name}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {request.buyer_location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={request.status === "pending" ? "default" : "secondary"}
                      className={request.status === "pending" ? "bg-primary-blue text-white" : ""}
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background-main rounded-lg border border-gray-800">
                      <h4 className="font-medium mb-2 text-text-primary">Product Details</h4>
                      <p className="text-sm text-text-secondary">
                        Price: <span className="text-success font-medium">${request.product?.price}</span>
                      </p>
                      <p className="text-sm text-text-secondary">
                        Quantity: <span className="text-text-primary font-medium">{request.quantity}</span>
                      </p>
                      <p className="text-sm text-text-secondary">
                        Total:{" "}
                        <span className="text-success font-medium">
                          ${(request.product?.price * request.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="p-4 bg-background-main rounded-lg border border-gray-800">
                      <h4 className="font-medium mb-2 text-text-primary">Buyer Information</h4>
                      <p className="text-sm text-text-secondary">
                        Email: <span className="text-text-primary">{request.buyer?.email}</span>
                      </p>
                      <p className="text-sm text-text-secondary">
                        Location: <span className="text-text-primary">{request.buyer?.location}</span>
                      </p>
                      <p className="text-sm text-text-secondary">
                        Request Location: <span className="text-text-primary">{request.buyer_location}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
