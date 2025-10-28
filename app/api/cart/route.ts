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

    const { product_id, quantity = 1 } = await request.json()
    const db = await getDb()

    const existingItem = await db.collection("cart_items").findOne({ buyer_id: decoded.userId, product_id })

    if (existingItem) {
      // Update quantity
      await db
        .collection("cart_items")
        .updateOne({ _id: existingItem._id }, { $set: { quantity: existingItem.quantity + quantity } })
      const updatedItem = await db.collection("cart_items").findOne({ _id: existingItem._id })
      if (updatedItem) {
        updatedItem.id = updatedItem._id.toString()
      }
      return NextResponse.json(updatedItem)
    } else {
      const created_at = new Date().toISOString()
      const insertResult = await db.collection("cart_items").insertOne({ buyer_id: decoded.userId, product_id, quantity, created_at })
      const newItem = await db.collection("cart_items").findOne({ _id: insertResult.insertedId })
      if (newItem) {
        newItem.id = newItem._id.toString()
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

    const db = await getDb()
    const cartItems = await db
      .collection("cart_items")
      .aggregate([
        { $match: { buyer_id: decoded.userId } },
        { $sort: { created_at: -1 } },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $addFields: { product: { $arrayElemAt: ["$product", 0] } } },
        {
          $lookup: {
            from: "users",
            localField: "product.seller_id",
            foreignField: "id",
            as: "seller",
          },
        },
        { $addFields: { "product.seller": { $arrayElemAt: ["$seller", 0] } } },
        { $addFields: { 
          id: { $toString: "$_id" }, 
          "product.id": { $toString: "$product._id" },
          "product.seller.id": { $toString: "$product.seller._id" }
        } },
        { $project: { "product.seller.password_hash": 0 } },
      ])
      .toArray()
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
    const db = await getDb()
    await db.collection("cart_items").updateOne({ _id: cart_item_id, buyer_id: decoded.userId }, { $set: { quantity } })
    const updatedItem = await db.collection("cart_items").findOne({ _id: cart_item_id, buyer_id: decoded.userId })
    if (updatedItem) {
      updatedItem.id = updatedItem._id.toString()
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

    const db = await getDb()
    await db.collection("cart_items").deleteOne({ _id: cartItemId, buyer_id: decoded.userId })
    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Cart delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
