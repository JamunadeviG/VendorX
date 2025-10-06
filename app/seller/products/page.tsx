import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, ArrowLeft, Package } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import DeleteProductButton from "@/components/delete-product-button"

async function getSellerProducts(sellerId: string) {
  const db = await getDb()
  const products = await db
    .collection("products")
    .find({ seller_id: sellerId })
    .sort({ created_at: -1 })
    .toArray()
  return products || []
}

export default async function SellerProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const decoded = await verifyToken(token)
  if (!decoded || decoded.role !== "seller") {
    redirect("/auth/login")
  }

  const products = await getSellerProducts(decoded.userId)

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/seller" className="text-primary-blue hover:text-secondary-blue transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Package className="h-6 w-6 text-accent-blue" />
            <h1 className="text-2xl font-bold text-text-primary">My Products</h1>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-text-secondary">{products.length} products found</p>
          <Link href="/seller/products/new">
            <Button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <Card className="card-dark">
            <CardContent className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-accent-blue mb-4" />
              <p className="text-text-secondary mb-4">You haven't added any products yet</p>
              <Link href="/seller/products/new">
                <Button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="card-dark hover:glow-effect transition-all duration-300">
                <CardHeader className="p-0">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg border-b border-gray-800"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 text-text-primary">{product.title}</CardTitle>
                  <CardDescription className="mb-3 line-clamp-2 text-text-secondary">
                    {product.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-success">${product.price}</span>
                    <span className="text-sm text-text-secondary">Stock: {product.stock_count}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/seller/products/${product.id}/edit`} className="flex-1">
                      <Button className="w-full btn-secondary">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} productTitle={product.title} />
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
