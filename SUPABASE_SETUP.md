# 🚀 Supabase Storage Setup Guide

## Overview

This Christmas Tree app uses Supabase Storage to store and serve user-uploaded photos. Follow these steps to set up your Supabase storage bucket.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Your Supabase project URL and anon key (already configured in `.env`)

## Step-by-Step Setup

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard: https://vtlktcygurszmyflbpll.supabase.co
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `christmas-tree-photos`
   - **Public bucket**: ✅ **YES** (Important!)
   - **Allowed MIME types**: Leave empty or add `image/*`
   - **File size limit**: Recommended 5 MB
5. Click **"Create bucket"**

### 2. Configure Bucket Policies

To allow public access to uploaded photos:

1. In the Storage section, click on your `christmas-tree-photos` bucket
2. Go to the **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add the following policies:

#### Policy 1: Public Read Access

```
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'christmas-tree-photos');
```

#### Policy 2: Public Upload Access

```sql
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'christmas-tree-photos');
```

#### Policy 3: Public Update Access (for overwriting)

```sql
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'christmas-tree-photos')
WITH CHECK (bucket_id = 'christmas-tree-photos');
```

#### Policy 4: Public Delete Access

```sql
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'christmas-tree-photos');
```

**Alternative**: If you want simpler setup, you can enable **"Public bucket"** when creating the bucket, which automatically allows public read access.

### 3. Verify Setup

After creating the bucket and policies:

1. Go to the Storage section
2. Click on `christmas-tree-photos` bucket
3. Try uploading a test image manually
4. Check if you can view the uploaded image via its public URL

### 4. Environment Variables

The `.env` file should already be configured with:

```env
VITE_SUPABASE_URL=https://vtlktcygurszmyflbpll.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Never commit the `.env` file to git! It's already in `.gitignore`.

## Testing the Upload Feature

1. Start your development server:

   ```bash
   npm run dev
   ```
2. Open the app in your browser
3. Click the **"📸 管理照片"** button
4. Upload a test photo:

   - Select a photo for `top.jpg`
   - Select one or more photos for tree body
   - Click **"上传照片"**
5. If successful, you should see:

   - Success message
   - Automatic page reload
   - Photos displayed on the Christmas tree

## Troubleshooting

### Error: "Upload failed: new row violates row-level security policy"

**Solution**: Make sure you've created the storage policies correctly. The bucket needs INSERT, SELECT, UPDATE, and DELETE policies for public access.

### Error: "Bucket not found"

**Solution**:

1. Verify the bucket name is exactly `christmas-tree-photos`
2. Check that the bucket exists in your Supabase project

### Photos not displaying after upload

**Solution**:

1. Verify the bucket is set to **Public**
2. Check browser console for errors
3. Manually verify files were uploaded in Supabase Storage UI
4. Try refreshing the page

### CORS errors

**Solution**: Supabase automatically handles CORS for storage. If you see CORS errors, check that your Supabase URL in `.env` is correct.

## Storage Limits

**Free Tier**:

- 1 GB storage
- 2 GB bandwidth per month
- 50 MB file size limit

For this Christmas tree app with ~31 photos at 500KB each, you'll use approximately:

- Storage: ~15 MB
- Bandwidth: ~15 MB per 1000 views

This is well within the free tier limits!

## Security Considerations

**Current Setup**: Public read/write access

- ✅ Easy to use
- ✅ No authentication required
- ⚠️ Anyone can upload/delete photos

**For Production**: Consider adding:

- File size limits
- Rate limiting
- User authentication
- Admin-only upload access

## Migration from Local Photos

If you have existing photos in `public/photos/`, you can:

1. Upload them manually through the Supabase Storage UI
2. Or use the photo manager in the app to upload them

The app will automatically use Supabase photos if the environment variables are set, otherwise it falls back to local photos.

## Next Steps

- ✅ Create the `christmas-tree-photos` bucket
- ✅ Configure public access policies
- ✅ Test uploading a photo
- ✅ Enjoy your Christmas tree with cloud-hosted photos! 🎄

---

**Need Help?** Check the [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
