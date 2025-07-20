"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-blue to-secondary-blue py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Contact VendorX</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
              <p className="text-text-secondary mb-8">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="card-dark">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-primary-blue" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Email</h3>
                      <p className="text-text-secondary">support@vendorx.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-dark">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-success" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Phone</h3>
                      <p className="text-text-secondary">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-dark">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-6 w-6 text-accent-blue" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Address</h3>
                      <p className="text-text-secondary">
                        123 Vendor Street
                        <br />
                        City, State 12345
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-dark">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-secondary-blue" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Business Hours</h3>
                      <p className="text-text-secondary">
                        Mon - Fri: 9:00 AM - 6:00 PM
                        <br />
                        Sat - Sun: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="card-dark glow-effect">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && (
                    <Alert className="bg-success/10 border-success text-success">
                      <AlertDescription>
                        Thank you for your message! We'll get back to you within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
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
                        Email Address
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-text-primary">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-text-primary">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full btn-primary">
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
