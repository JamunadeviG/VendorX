"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Package } from "lucide-react"
import ImageUpload from "@/components/image-upload"

const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
  "Other",
]

export default function EditProductPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stockCount, setStockCount] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const product = await response.json()
          setTitle(product.title)
          setDescription(product.description || "")
          setPrice(product.price.toString())
          setStockCount(product.stock_count.toString())
          setCategory(product.category)
          setImageUrl(product.image_url || "")
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to load product")
      } finally {
        setLoadingProduct(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Number.parseFloat(price),
          stock_count: Number.parseInt(stockCount),
          category,
          image_url: imageUrl || "/placeholder.svg?height=300&width=300",
        }),
      })

      if (response.ok) {
        router.push("/seller/products")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update product")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-main">
      <div className="bg-background-surface shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/seller/products" className="text-primary-blue hover:text-secondary-blue transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Package className="h-6 w-6 text-accent-blue" />
            <h1 className="text-2xl font-bold text-text-primary">Edit Product</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto card-dark glow-effect">
          <CardHeader>
            <CardTitle className="text-text-primary">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-destructive/10 border-destructive text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-text-primary">
                  Product Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text-primary">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-text-primary">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-text-primary">
                    Stock Count
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    required
                    className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-text-primary">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-input border-gray-700 text-text-primary focus:border-primary-blue">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background-surface border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-text-primary hover:bg-gray-800">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUpload value={imageUrl} onChange={setImageUrl} />

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="flex-1 btn-primary">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Product
                </Button>
                <Link href="/seller/products" className="flex-1">
                  <Button type="button" className="w-full btn-secondary">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
