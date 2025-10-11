/*
  # Royalwood Furniture E-commerce Database Schema

  ## Overview
  This migration creates the complete database schema for a luxury furniture e-commerce platform.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category image
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. products
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid) - Foreign key to categories
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `description` (text) - Product description
  - `price` (decimal) - Product price
  - `compare_at_price` (decimal, nullable) - Original price for discounts
  - `images` (jsonb) - Array of product images
  - `in_stock` (boolean) - Stock availability
  - `stock_quantity` (integer) - Available quantity
  - `featured` (boolean) - Featured product flag
  - `materials` (text) - Materials used
  - `dimensions` (text) - Product dimensions
  - `weight` (text) - Product weight
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. cart_items
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid) - Foreign key to auth.users
  - `product_id` (uuid) - Foreign key to products
  - `quantity` (integer) - Item quantity
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. profiles
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Categories and products are publicly readable
  - Cart items are only accessible by the owning user
  - Profiles are only accessible by the owning user
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  images jsonb DEFAULT '[]'::jsonb,
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  featured boolean DEFAULT false,
  materials text DEFAULT '',
  dimensions text DEFAULT '',
  weight text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Cart items policies
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Living Room', 'living-room', 'Elegant furniture for your living spaces', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'),
  ('Bedroom', 'bedroom', 'Luxurious bedroom furniture for ultimate comfort', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'),
  ('Dining Room', 'dining-room', 'Sophisticated dining furniture for memorable meals', 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg'),
  ('Office', 'office', 'Professional furniture for your workspace', 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg'),
  ('Outdoor', 'outdoor', 'Durable and stylish outdoor furniture', 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, images, in_stock, stock_quantity, featured, materials, dimensions, weight) 
SELECT 
  c.id,
  'Royal Oak Dining Table',
  'royal-oak-dining-table',
  'Handcrafted from premium solid oak, this dining table combines timeless elegance with exceptional durability. Features a natural wood grain finish that highlights the beauty of the wood.',
  2499.99,
  3299.99,
  '[
    "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg",
    "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"
  ]'::jsonb,
  true,
  12,
  true,
  'Solid Oak Wood, Natural Oil Finish',
  '200cm x 100cm x 75cm',
  '85kg'
FROM categories c WHERE c.slug = 'dining-room'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, images, in_stock, stock_quantity, featured, materials, dimensions, weight)
SELECT 
  c.id,
  'Luxe Walnut Bed Frame',
  'luxe-walnut-bed-frame',
  'A masterpiece of craftsmanship, featuring rich walnut wood with intricate detailing. This king-size bed frame is designed to be the centerpiece of your bedroom.',
  3799.99,
  '[
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg"
  ]'::jsonb,
  true,
  8,
  true,
  'Premium Walnut Wood, Hand-rubbed Finish',
  '220cm x 200cm x 120cm',
  '120kg'
FROM categories c WHERE c.slug = 'bedroom'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, compare_at_price, images, in_stock, stock_quantity, featured, materials, dimensions, weight)
SELECT 
  c.id,
  'Executive Teak Desk',
  'executive-teak-desk',
  'Elevate your workspace with this stunning teak executive desk. Features integrated cable management and spacious drawers for ultimate functionality.',
  1899.99,
  2499.99,
  '[
    "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg",
    "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg"
  ]'::jsonb,
  true,
  15,
  true,
  'Solid Teak Wood, Brass Hardware',
  '180cm x 90cm x 75cm',
  '65kg'
FROM categories c WHERE c.slug = 'office'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, images, in_stock, stock_quantity, materials, dimensions, weight)
SELECT 
  c.id,
  'Heritage Leather Sofa',
  'heritage-leather-sofa',
  'Premium full-grain leather meets solid oak frame in this luxurious three-seater sofa. Designed for generations of comfort and style.',
  4299.99,
  '[
    "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
    "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg"
  ]'::jsonb,
  true,
  6,
  'Full-grain Leather, Oak Wood Frame',
  '240cm x 95cm x 85cm',
  '95kg'
FROM categories c WHERE c.slug = 'living-room'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, images, in_stock, stock_quantity, materials, dimensions, weight)
SELECT 
  c.id,
  'Garden Teak Lounge Set',
  'garden-teak-lounge-set',
  'Weather-resistant teak outdoor furniture set including two lounge chairs and a coffee table. Built to withstand the elements while maintaining elegance.',
  2799.99,
  '[
    "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg",
    "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg"
  ]'::jsonb,
  true,
  10,
  'Grade-A Teak Wood, Stainless Steel Hardware',
  'Chairs: 80cm x 70cm x 85cm, Table: 120cm x 60cm x 45cm',
  '55kg (total)'
FROM categories c WHERE c.slug = 'outdoor'
ON CONFLICT (slug) DO NOTHING;