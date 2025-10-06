"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [role, setRole] = useState<"buyer" | "seller">("buyer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, location, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to sign up")
        setLoading(false)
        return
      }
      // redirect based on role
      router.push(role === "seller" ? "/seller" : "/buyer")
    } catch (err) {
      setError("Something went wrong. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main px-4">
      <Card className="w-full max-w-md card-dark glow-effect">
        <CardHeader>
          <CardTitle className="text-text-primary text-2xl">Create account</CardTitle>
          <CardDescription className="text-text-secondary">Sign up with MongoDB-backed auth</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {error && (
              <Alert className="bg-destructive/10 border-destructive text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-primary">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-input border-gray-700 text-text-primary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input border-gray-700 text-text-primary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-input border-gray-700 text-text-primary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-text-primary">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-input border-gray-700 text-text-primary" />
            </div>

            <div className="space-y-2">
              <Label className="text-text-primary">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "buyer" | "seller")}> 
                <SelectTrigger className="bg-input border-gray-700 text-text-primary">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
