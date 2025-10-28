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
    if (!decoded || decoded.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, price, stock_count, category, image_url } = await request.json()
    const db = await getDb()
    const created_at = new Date().toISOString()

    const insertResult = await db.collection("products").insertOne({
      title,
      description,
      price,
      stock_count,
      category,
      image_url,
      seller_id: decoded.userId,
      created_at,
    })

    const product = await db.collection("products").findOne({ _id: insertResult.insertedId })
    // Add id field for frontend compatibility
    if (product) {
      product.id = product._id.toString()
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const products = await db
      .collection("products")
      .aggregate([
        { $match: { stock_count: { $gt: 0 } } },
        { $sort: { created_at: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "seller_id",
            foreignField: "id",
            as: "seller",
          },
        },
        { $addFields: { seller: { $arrayElemAt: ["$seller", 0] } } },
        { $addFields: { 
          id: { $toString: "$_id" },
          "seller.id": { $toString: "$seller._id" }
        } },
        { $project: { "seller.password_hash": 0 } },
      ])
      .toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
