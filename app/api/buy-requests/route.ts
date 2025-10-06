import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

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

    const { product_id, quantity = 1, buyer_location } = await request.json()
    const db = await getDb()

    const product = await db
      .collection("products")
      .findOne({ id: product_id }, { projection: { seller_id: 1, stock_count: 1 } })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock_count < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Create buy request
    const created_at = new Date().toISOString()
    const id = `${decoded.userId}-${product_id}-${created_at}`
    await db.collection("buy_requests").insertOne({
      id,
      buyer_id: decoded.userId,
      product_id,
      seller_id: product.seller_id,
      quantity,
      buyer_location,
      status: "pending",
      created_at,
    })
    const buyRequest = await db.collection("buy_requests").findOne({ id })
    return NextResponse.json(buyRequest)
  } catch (error) {
    console.error("Buy request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
