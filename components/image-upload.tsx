"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, LinkIcon, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setUploading(true)

    try {
      // Convert to base64 for demo purposes
      // In production, you'd upload to a service like Cloudinary, AWS S3, etc.
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Upload failed:", error)
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  return (
    <div className="space-y-4">
      <Label className="text-text-primary">Product Image</Label>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-background-surface">
          <TabsTrigger value="url" className="text-text-primary data-[state=active]:bg-primary-blue">
            <LinkIcon className="mr-2 h-4 w-4" />
            Image URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-text-primary data-[state=active]:bg-primary-blue">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-input border-gray-700 text-text-primary focus:border-primary-blue focus:ring-primary-blue"
          />
          <div className="text-sm text-text-secondary">
            <p className="mb-2">Free image hosting suggestions:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                <strong>Imgur.com</strong> - Upload → Right-click → Copy image address
              </li>
              <li>
                <strong>Postimages.org</strong> - No account needed
              </li>
              <li>
                <strong>ImgBB.com</strong> - Simple and fast
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary-blue bg-primary-blue/10" : "border-gray-700 hover:border-gray-600"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-accent-blue mb-4" />
            <p className="text-text-primary mb-2">
              {uploading ? "Processing..." : "Drag & drop an image here, or click to select"}
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={uploading}
              className="btn-secondary"
            >
              {uploading ? "Processing..." : "Select Image"}
            </Button>
          </div>
          <p className="text-xs text-text-secondary">
            Note: This demo converts to base64. In production, use proper image hosting.
          </p>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {value && (
        <div className="mt-4">
          <Label className="text-text-primary mb-2 block">Preview:</Label>
          <div className="relative w-full max-w-sm">
            <img
              src={value || "/placeholder.svg"}
              alt="Product preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=200&width=300"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
