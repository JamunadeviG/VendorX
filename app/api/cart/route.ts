import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "buyer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { product_id, quantity = 1 } = await request.json()
    const supabase = createServerClient()

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("buyer_id", decoded.userId)
      .eq("product_id", product_id)
      .single()

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }

      return NextResponse.json(updatedItem)
    } else {
      // Add new item
      const { data: newItem, error } = await supabase
        .from("cart_items")
        .insert({
          buyer_id: decoded.userId,
          product_id,
          quantity,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }

      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error("Cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "buyer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        product:products(
          *,
          seller:users!products_seller_id_fkey(name, location)
        )
      `)
      .eq("buyer_id", decoded.userId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "buyer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cart_item_id, quantity } = await request.json()
    const supabase = createServerClient()

    const { data: updatedItem, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cart_item_id)
      .eq("buyer_id", decoded.userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Cart update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "buyer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("id")

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId).eq("buyer_id", decoded.userId)

    if (error) {
      return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
    }

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Cart delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
