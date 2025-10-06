import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const productId = params.id

    const product = await db
      .collection("products")
      .aggregate([
        { $match: { id: productId } },
        {
          $lookup: {
            from: "users",
            localField: "seller_id",
            foreignField: "id",
            as: "seller",
          },
        },
        { $addFields: { seller: { $arrayElemAt: ["$seller", 0] } } },
        { $project: { "seller.password_hash": 0 } },
      ])
      .next()

    if (!product) {
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
    const db = await getDb()

    const existingProduct = await db.collection("products").findOne({ id: productId })

    if (!existingProduct || existingProduct.seller_id !== decoded.userId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    await db.collection("products").updateOne(
      { id: productId },
      {
        $set: {
          title,
          description,
          price,
          stock_count,
          category,
          image_url,
        },
      }
    )

    const product = await db.collection("products").findOne({ id: productId })
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
    const db = await getDb()
    const existingProduct = await db.collection("products").findOne({ id: productId })

    if (!existingProduct || existingProduct.seller_id !== decoded.userId) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    await db.collection("products").deleteOne({ id: productId })
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
