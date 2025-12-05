-- ============================================
-- Supabase Storage Policies for Christmas Tree App
-- Bucket: christmas-tree-photos
-- ============================================

-- Execute these commands in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run

-- ============================================
-- POLICY 1: Allow Public Read Access
-- ============================================
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'christmas-tree-photos');

-- ============================================
-- POLICY 2: Allow Public Upload/Insert
-- ============================================
CREATE POLICY "Allow public upload"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'christmas-tree-photos');

-- ============================================
-- POLICY 3: Allow Public Update (for overwriting files)
-- ============================================
CREATE POLICY "Allow public update"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'christmas-tree-photos')
WITH CHECK (bucket_id = 'christmas-tree-photos');

-- ============================================
-- POLICY 4: Allow Public Delete
-- ============================================
CREATE POLICY "Allow public delete"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'christmas-tree-photos');

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify your policies were created:
SELECT 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%public%';

-- ============================================
-- CLEANUP (if you need to remove policies)
-- ============================================
-- Uncomment and run if you need to reset:
-- DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
