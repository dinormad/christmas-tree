# ⚡ Quick Supabase Setup Checklist

Follow these steps to enable cloud photo uploads:

## ✅ Step 1: Create Storage Bucket

1. Open Supabase Dashboard: https://vtlktcygurszmyflbpll.supabase.co
2. Go to **Storage** → **Create a new bucket**
3. Settings:
   ```
   Name: christmas-tree-photos
   Public bucket: ✅ YES
   ```

## ✅ Step 2: Set Bucket Policies

Click on your bucket → **Policies** tab → **New Policy** → **For full customization**

Paste each policy:

```sql
-- Policy 1: Read
CREATE POLICY "Public Read" ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'christmas-tree-photos');

-- Policy 2: Insert
CREATE POLICY "Public Insert" ON storage.objects 
FOR INSERT TO public 
WITH CHECK (bucket_id = 'christmas-tree-photos');

-- Policy 3: Update
CREATE POLICY "Public Update" ON storage.objects 
FOR UPDATE TO public 
USING (bucket_id = 'christmas-tree-photos');

-- Policy 4: Delete
CREATE POLICY "Public Delete" ON storage.objects 
FOR DELETE TO public 
USING (bucket_id = 'christmas-tree-photos');
```

## ✅ Step 3: Test Upload

1. Run your app: `npm run dev`
2. Click **"📸 管理照片"**
3. Upload a test photo
4. Click **"上传照片"**
5. Wait for success message and auto-reload

## 🎯 Done!

Your Christmas tree now has cloud photo storage! 🎄☁️

---

**Troubleshooting**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed help.
