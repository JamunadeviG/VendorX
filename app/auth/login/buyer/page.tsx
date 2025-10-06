"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function BuyerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "buyer" }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/buyer")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main px-4">
      <Card className="w-full max-w-md card-dark glow-effect">
        <CardHeader>
          <CardTitle className="text-text-primary text-2xl">Buyer Sign In</CardTitle>
          <CardDescription className="text-text-secondary">
            Enter your buyer credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-destructive/10 border-destructive text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-text-secondary">Vendor? </span>
            <Link href="/auth/login/vendor" className="text-primary-blue hover:text-secondary-blue transition-colors">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


