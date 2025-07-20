import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, location } = await request.json()
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role,
        location,
      })
      .select("id, name, email, role, location, created_at")
      .single()

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Generate JWT token
    const token = await generateToken(user.id, user.role)

    const response = NextResponse.json({
      user,
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
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
