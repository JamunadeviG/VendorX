"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BuyNowButtonProps {
  productId: string
  quantity?: number
}

export default function BuyNowButton({ productId, quantity = 1 }: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleBuyNow = async () => {
    setLoading(true)

    try {
      // Get user location
      let location = "Unknown"
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          location = `${position.coords.latitude}, ${position.coords.longitude}`
        } catch {
          location = prompt("Please enter your location:") || "Unknown"
        }
      } else {
        location = prompt("Please enter your location:") || "Unknown"
      }

      const response = await fetch("/api/buy-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          quantity,
          buyer_location: location,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Buy request sent to seller!",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create buy request",
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
    <Button onClick={handleBuyNow} disabled={loading} className="btn-primary">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
      Buy Now
    </Button>
  )
}
