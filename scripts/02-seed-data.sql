-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (email, password_hash, name, role, location) VALUES
('seller1@example.com', '$2b$10$rOzJqQZQQQQQQQQQQQQQQu', 'John Seller', 'seller', 'New York'),
('seller2@example.com', '$2b$10$rOzJqQZQQQQQQQQQQQQQQu', 'Jane Store', 'seller', 'Los Angeles'),
('buyer1@example.com', '$2b$10$rOzJqQZQQQQQQQQQQQQQQu', 'Mike Buyer', 'buyer', 'Chicago'),
('buyer2@example.com', '$2b$10$rOzJqQZQQQQQQQQQQQQQQu', 'Sarah Customer', 'buyer', 'Miami')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, stock_count, category, image_url, seller_id) 
SELECT 
  'Wireless Headphones',
  'High-quality wireless headphones with noise cancellation',
  99.99,
  50,
  'Electronics',
  '/placeholder.svg?height=300&width=300',
  u.id
FROM users u WHERE u.email = 'seller1@example.com'
UNION ALL
SELECT 
  'Smart Watch',
  'Feature-rich smartwatch with health tracking',
  199.99,
  25,
  'Electronics',
  '/placeholder.svg?height=300&width=300',
  u.id
FROM users u WHERE u.email = 'seller1@example.com'
UNION ALL
SELECT 
  'Coffee Maker',
  'Automatic drip coffee maker with programmable timer',
  79.99,
  30,
  'Home & Kitchen',
  '/placeholder.svg?height=300&width=300',
  u.id
FROM users u WHERE u.email = 'seller2@example.com'
UNION ALL
SELECT 
  'Running Shoes',
  'Comfortable running shoes for all terrains',
  129.99,
  40,
  'Sports',
  '/placeholder.svg?height=300&width=300',
  u.id
FROM users u WHERE u.email = 'seller2@example.com';
