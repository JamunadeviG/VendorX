"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added to cart!",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to add to cart",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={loading} className="w-full btn-primary">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      Add to Cart
    </Button>
  )
}
