"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CartItemControlsProps {
  cartItemId: string
  currentQuantity: number
  maxStock: number
}

export default function CartItemControls({ cartItemId, currentQuantity, maxStock }: CartItemControlsProps) {
  const [quantity, setQuantity] = useState(currentQuantity)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return

    setLoading(true)
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }),
      })

      if (response.ok) {
        setQuantity(newQuantity)
        router.refresh()
        toast({
          title: "Success",
          description: "Cart updated!",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update cart",
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

  const deleteItem = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
        toast({
          title: "Success",
          description: "Item removed from cart!",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to remove item",
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
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 border border-gray-700 rounded-lg bg-input">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1 || loading}
          className="h-8 w-8 p-0 text-text-primary hover:bg-gray-700"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          min="1"
          max={maxStock}
          value={quantity}
          onChange={(e) => {
            const newQty = Number.parseInt(e.target.value)
            if (newQty >= 1 && newQty <= maxStock) {
              setQuantity(newQty)
            }
          }}
          onBlur={() => updateQuantity(quantity)}
          className="w-16 h-8 text-center border-0 bg-transparent text-text-primary"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={quantity >= maxStock || loading}
          className="h-8 w-8 p-0 text-text-primary hover:bg-gray-700"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <Button variant="destructive" size="sm" onClick={deleteItem} disabled={deleting} className="h-8 w-8 p-0">
        {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
      </Button>
    </div>
  )
}
