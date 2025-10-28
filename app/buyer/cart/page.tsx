import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import BuyNowButton from "@/components/buy-now-button"
import CartItemControls from "@/components/cart-item-controls"

async function getCartItems(buyerId: string) {
  const db = await getDb()
  const cartItems = await db
    .collection("cart_items")
    .aggregate([
      { $match: { buyer_id: buyerId } },
      { $sort: { created_at: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $addFields: { product: { $arrayElemAt: ["$product", 0] } } },
      {
        $lookup: {
          from: "users",
          localField: "product.seller_id",
          foreignField: "id",
          as: "seller",
        },
      },
      { $addFields: { "product.seller": { $arrayElemAt: ["$seller", 0] } } },
      { $addFields: { 
        id: { $toString: "$_id" }, 
        "product.id": { $toString: "$product._id" },
        "product.seller.id": { $toString: "$product.seller._id" }
      } },
      { $project: { "product.seller.password_hash": 0 } },
    ])
    .toArray()
  return cartItems || []
}

export default async function CartPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const decoded = await verifyToken(token)
  if (!decoded || decoded.role !== "buyer") {
    redirect("/auth/login")
  }

  const cartItems = await getCartItems(decoded.userId)
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/buyer" className="text-primary-blue hover:text-secondary-blue transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Shopping Cart</h1>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="card-dark">
            <CardContent className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-accent-blue mb-4" />
              <p className="text-text-secondary mb-4">Your cart is empty</p>
              <Link href="/buyer">
                <Button className="btn-primary">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <Card key={item.id} className="card-dark hover:glow-effect transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.product?.image_url || "/placeholder.svg?height=100&width=100"}
                        alt={item.product?.title || "Product"}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover border border-gray-700"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-text-primary">{item.product?.title}</h3>
                        <p className="text-text-secondary text-sm mb-2">
                          Sold by {item.product?.seller?.name} from {item.product?.seller?.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-success">${item.product?.price}</span>
                            <span className="text-text-secondary text-sm">Stock: {item.product?.stock_count}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <CartItemControls
                              cartItemId={item.id}
                              currentQuantity={item.quantity}
                              maxStock={item.product?.stock_count || 1}
                            />
                            <BuyNowButton productId={item.product_id} quantity={item.quantity} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="card-dark glow-effect">
                <CardHeader>
                  <CardTitle className="text-text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-text-primary">
                    <span>Items ({cartItems.length})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-primary">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between font-bold text-lg text-text-primary">
                    <span>Total</span>
                    <span className="text-success">${total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full btn-primary" size="lg">
                    Buy All Items
                  </Button>
                  <p className="text-xs text-text-secondary text-center">
                    * No payment processing - this creates buy requests for sellers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
