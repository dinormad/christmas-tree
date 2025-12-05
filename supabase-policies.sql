-- ============================================
-- Supabase Storage Policies for Christmas Tree App
-- Bucket: christmas-tree-photos
-- ============================================

-- ⚠️ IMPORTANT: You CANNOT run SQL for storage policies directly
-- You must use the Supabase Dashboard UI instead

-- ============================================
-- EASY FIX: Use Dashboard UI (Recommended)
-- ============================================

-- STEP 1: Go to Supabase Dashboard
-- https://supabase.com/dashboard/project/YOUR_PROJECT/storage/policies

-- STEP 2: Click on "christmas-tree-photos" bucket

-- STEP 3: Click "New Policy" button

-- STEP 4: Create these 4 policies using the UI:

-- ----------------------------------------
-- Policy 1: Upload (INSERT)
-- ----------------------------------------
-- Name: Users can upload to own folder
-- Allowed operation: INSERT
-- Policy definition:
-- (bucket_id = 'christmas-tree-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
-- Target roles: authenticated

-- ----------------------------------------
-- Policy 2: Update (UPDATE)
-- ----------------------------------------
-- Name: Users can update own files
-- Allowed operation: UPDATE
-- Policy definition:
-- (bucket_id = 'christmas-tree-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
-- Target roles: authenticated

-- ----------------------------------------
-- Policy 3: Delete (DELETE)
-- ----------------------------------------
-- Name: Users can delete own files
-- Allowed operation: DELETE
-- Policy definition:
-- (bucket_id = 'christmas-tree-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
-- Target roles: authenticated

-- ----------------------------------------
-- Policy 4: Read (SELECT)
-- ----------------------------------------
-- Name: Users can read own files
-- Allowed operation: SELECT
-- Policy definition:
-- (bucket_id = 'christmas-tree-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
-- Target roles: authenticated

-- ============================================
-- ALTERNATIVE QUICK FIX (Easiest)
-- ============================================
-- If policies are too complex, just make the bucket PUBLIC:
-- 
-- 1. Go to: Storage > christmas-tree-photos
-- 2. Click the gear icon (⚙️)
-- 3. Toggle "Public bucket" to ON
-- 4. Click "Save"
-- 
-- This allows:
-- ✅ Anyone can READ photos (good for sharing)
-- ❌ Only authenticated users can WRITE (still protected by your app code)
--
-- This is the SIMPLEST solution and works perfectly for your use case!
