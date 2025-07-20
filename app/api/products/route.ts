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
    if (!decoded || decoded.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, price, stock_count, category, image_url } = await request.json()
    const supabase = createServerClient()

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title,
        description,
        price,
        stock_count,
        category,
        image_url,
        seller_id: decoded.userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Product creation error:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        seller:users!products_seller_id_fkey(name, location)
      `)
      .gt("stock_count", 0)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Products fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
