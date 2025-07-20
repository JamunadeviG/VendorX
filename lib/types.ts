export interface User {
  id: string
  email: string
  name: string
  role: "seller" | "buyer"
  location?: string
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  stock_count: number
  category: string
  image_url: string
  seller_id: string
  seller?: User
  created_at: string
}

export interface BuyRequest {
  id: string
  buyer_id: string
  product_id: string
  seller_id: string
  quantity: number
  buyer_location: string
  status: string
  created_at: string
  buyer?: User
  product?: Product
}

export interface CartItem {
  id: string
  buyer_id: string
  product_id: string
  quantity: number
  product?: Product
}
