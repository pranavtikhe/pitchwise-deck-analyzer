-- SQL to update the pitch_insights table with new fields

-- Add new columns for the enhanced analysis
ALTER TABLE pitch_insights 
ADD COLUMN IF NOT EXISTS strengths TEXT,
ADD COLUMN IF NOT EXISTS weaknesses TEXT,
ADD COLUMN IF NOT EXISTS competitors TEXT,
ADD COLUMN IF NOT EXISTS funding_history TEXT,
ADD COLUMN IF NOT EXISTS expert_opinions TEXT,
ADD COLUMN IF NOT EXISTS key_questions TEXT,
ADD COLUMN IF NOT EXISTS suggested_improvements TEXT,
ADD COLUMN IF NOT EXISTS key_insights TEXT,
ADD COLUMN IF NOT EXISTS market_comparison TEXT,
ADD COLUMN IF NOT EXISTS exit_potential TEXT,
ADD COLUMN IF NOT EXISTS overall_reputation TEXT,
ADD COLUMN IF NOT EXISTS innovation_rating INTEGER,
ADD COLUMN IF NOT EXISTS market_potential_rating INTEGER,
ADD COLUMN IF NOT EXISTS competitive_advantage_rating INTEGER,
ADD COLUMN IF NOT EXISTS financial_strength_rating INTEGER,
ADD COLUMN IF NOT EXISTS team_rating INTEGER,
ADD COLUMN IF NOT EXISTS overall_rating INTEGER;

-- Add rating insights columns to the pitch_insights table
ALTER TABLE pitch_insights
ADD COLUMN IF NOT EXISTS innovation_insights TEXT,
ADD COLUMN IF NOT EXISTS market_potential_insights TEXT,
ADD COLUMN IF NOT EXISTS competitive_advantage_insights TEXT,
ADD COLUMN IF NOT EXISTS financial_strength_insights TEXT,
ADD COLUMN IF NOT EXISTS team_insights TEXT,
ADD COLUMN IF NOT EXISTS overall_insights TEXT;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON pitch_insights;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own data" ON pitch_insights;
DROP POLICY IF EXISTS "Allow users to read their own data" ON pitch_insights;
DROP POLICY IF EXISTS "Allow users to update their own data" ON pitch_insights;
DROP POLICY IF EXISTS "Allow users to delete their own data" ON pitch_insights;

-- Create policy for anonymous inserts (when user_id is null)
CREATE POLICY "Allow anonymous inserts"
ON pitch_insights
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create policy for authenticated users to insert their own data
CREATE POLICY "Allow authenticated users to insert their own data"
ON pitch_insights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to read their own data and anonymous data
CREATE POLICY "Allow users to read their own data"
ON pitch_insights
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to update their own data
CREATE POLICY "Allow users to update their own data"
ON pitch_insights
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own data
CREATE POLICY "Allow users to delete their own data"
ON pitch_insights
FOR DELETE
USING (auth.uid() = user_id);

-- Update RLS policies to allow access to the new columns
CREATE POLICY IF NOT EXISTS "Users can view their own pitch insights with rating insights"
ON pitch_insights
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own pitch insights with rating insights"
ON pitch_insights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own pitch insights with rating insights"
ON pitch_insights
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own pitch insights with rating insights"
ON pitch_insights
FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on the table if not already enabled
ALTER TABLE pitch_insights ENABLE ROW LEVEL SECURITY;
