import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "buyer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { product_id, quantity = 1, buyer_location } = await request.json()
    const supabase = createServerClient()

    // Get product details to find seller
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("seller_id, stock_count")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock_count < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Create buy request
    const { data: buyRequest, error } = await supabase
      .from("buy_requests")
      .insert({
        buyer_id: decoded.userId,
        product_id,
        seller_id: product.seller_id,
        quantity,
        buyer_location,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Buy request error:", error)
      return NextResponse.json({ error: "Failed to create buy request" }, { status: 500 })
    }

    return NextResponse.json(buyRequest)
  } catch (error) {
    console.error("Buy request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
