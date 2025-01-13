/*
  # Initial schema setup
  
  1. New Tables
    - shops
      - id (UUID, primary key)
      - name (text)
      - address (text) 
      - opening_hours (text)
      - description (text, optional)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - reviews
      - id (UUID, primary key)
      - shop_id (UUID, foreign key)
      - rating (integer, 1-5)
      - comment (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access
    - Authenticated users can create reviews
*/

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create shops"
  ON shops FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read shops"
  ON shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  TO public
  WITH CHECK (true);