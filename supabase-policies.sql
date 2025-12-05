-- ============================================
-- Supabase Storage Policies for Christmas Tree App
-- Bucket: christmas-tree-photos
-- WITH USER AUTHENTICATION & ISOLATION
-- ============================================

-- IMPORTANT: First, drop any existing conflicting policies
-- Run this in Supabase SQL Editor before creating new policies

-- ============================================
-- STEP 1: Clean up existing policies (run this first)
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;

-- ============================================
-- STEP 2: Create user-specific policies
-- ============================================
-- Photos are stored as: {user-id}/top.jpg, {user-id}/1.jpg, etc.

-- Allow authenticated users to read ONLY their own photos
CREATE POLICY "Users can read own photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'christmas-tree-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to upload ONLY to their own folder
CREATE POLICY "Users can upload own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'christmas-tree-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update ONLY their own photos
CREATE POLICY "Users can update own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'christmas-tree-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete ONLY their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'christmas-tree-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- STEP 3: Verification (optional)
-- ============================================
-- Run this to verify your policies were created correctly:
SELECT 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- ============================================
-- ALTERNATIVE: If policies still don't work, try this simpler approach
-- ============================================
-- Instead of RLS policies, you can make the bucket public:
-- 1. Go to Storage > christmas-tree-photos
-- 2. Click the gear icon (settings)
-- 3. Toggle "Public bucket" to ON
-- This automatically allows public read access without policies
