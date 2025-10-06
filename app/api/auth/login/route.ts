import { type NextRequest, NextResponse } from "next/server"
import { comparePassword, generateToken } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Try DB first
    let user: any = null
    try {
      const db = await getDb()
      user = await db.collection("users").findOne({ email, role: role === "seller" ? "seller" : "buyer" })
      if (user && user.password_hash) {
        const ok = await comparePassword(password, user.password_hash)
        if (!ok) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }
      } else if (user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } catch {
      // ignore DB errors and fall back to demo user
    }

    if (!user) {
      const allowedEmail = "jamunadevig.23aim@kongu.edu"
      const allowedPassword = "demo123"
      const demoRole = role === "seller" ? "seller" : "buyer"
      if (email !== allowedEmail || password !== allowedPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
      user = {
        id: `demo-${demoRole}-id`,
        email: allowedEmail,
        name: demoRole === "seller" ? "Demo Seller" : "Demo Buyer",
        role: demoRole,
        location: "Demo Location",
        created_at: new Date().toISOString(),
      }
    }
    // Generate JWT token
    const token = await generateToken(user.id, user.role)

    // Create response with user data (excluding password)
    const { password_hash, ...userWithoutPassword } = user
    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
