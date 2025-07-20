"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"seller" | "buyer">("buyer")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "seller" || roleParam === "buyer") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, location }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect based on user role
        if (data.user.role === "seller") {
          router.push("/seller")
        } else {
          router.push("/buyer")
        }
      } else {
        setError(data.error || "Signup failed")
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
          <CardTitle className="text-text-primary text-2xl">Create Account</CardTitle>
          <CardDescription className="text-text-secondary">Join our marketplace as a seller or buyer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-destructive/10 border-destructive text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-primary">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>

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
                minLength={6}
                className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-text-primary">
                I am a
              </Label>
              <Select value={role} onValueChange={(value: "seller" | "buyer") => setRole(value)}>
                <SelectTrigger className="bg-input border-gray-700 text-text-primary focus:border-primary-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background-surface border-gray-700">
                  <SelectItem value="buyer" className="text-text-primary hover:bg-gray-800">
                    Buyer
                  </SelectItem>
                  <SelectItem value="seller" className="text-text-primary hover:bg-gray-800">
                    Seller
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-text-primary">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city/location"
                className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link href="/auth/login" className="text-primary-blue hover:text-secondary-blue transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
