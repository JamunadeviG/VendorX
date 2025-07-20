import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const productId = params.id

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        seller:users!products_seller_id_fkey(name, location)
      `)
      .eq("id", productId)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id
    const { title, description, price, stock_count, category, image_url } = await request.json()
    const supabase = createServerClient()

    // Check if product belongs to the seller
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("seller_id")
      .eq("id", productId)
      .single()

    if (checkError || !existingProduct || existingProduct.seller_id !== decoded.userId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    // Update product
    const { data: product, error } = await supabase
      .from("products")
      .update({
        title,
        description,
        price,
        stock_count,
        category,
        image_url,
      })
      .eq("id", productId)
      .select()
      .single()

    if (error) {
      console.error("Product update error:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id
    const supabase = createServerClient()

    // Check if product belongs to the seller
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("seller_id")
      .eq("id", productId)
      .single()

    if (checkError || !existingProduct || existingProduct.seller_id !== decoded.userId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      console.error("Product delete error:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
