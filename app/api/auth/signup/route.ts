import { type NextRequest, NextResponse } from "next/server"
import { generateToken, hashPassword } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, location, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password and name are required" }, { status: 400 })
    }

    const normalizedRole = role === "seller" ? "seller" : "buyer"
    const db = await getDb()

    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const password_hash = await hashPassword(password)
    const created_at = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.collection("users").insertOne({ id, email, name, role: normalizedRole, location, password_hash, created_at })

    const token = await generateToken(id, normalizedRole)

    const userWithoutPassword = { id, email, name, role: normalizedRole, location, created_at }

    const response = NextResponse.json({ user: userWithoutPassword, token })
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })
    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
