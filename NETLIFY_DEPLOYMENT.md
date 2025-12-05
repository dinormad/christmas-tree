# 🚀 Netlify Deployment Guide

## ✅ Pre-Deployment Checklist

Your app is ready for Netlify! Here's what's been configured:

- ✅ `netlify.toml` created with build settings
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA routing configured
- ✅ Environment variables set in `.env`
- ✅ `.env` in `.gitignore` (won't be committed)
- ✅ Supabase integration ready

## 📋 Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or leave blank for random)
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variables**:
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://vtlktcygurszmyflbpll.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bGt0Y3lndXJzem15ZmxicGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDc5MDYsImV4cCI6MjA1NjUyMzkwNn0.h_G94Yhdzsn1NoLffxP5jYX3SWR5VWQQrFKt8HxrV_8"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Web UI

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: 18

3. **Add Environment Variables**:
   - In Netlify dashboard → Site settings → Environment variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL = https://vtlktcygurszmyflbpll.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bGt0Y3lndXJzem15ZmxicGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDc5MDYsImV4cCI6MjA1NjUyMzkwNn0.h_G94Yhdzsn1NoLffxP5jYX3SWR5VWQQrFKt8HxrV_8
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `your-site-name.netlify.app`

## 🎯 Important: Photo Storage Strategy

You have two options for photos on Netlify:

### Option A: Use Supabase (Recommended for Production)

1. Upload all photos to Supabase using the photo manager
2. In `src/App.tsx`, change line 24:
   ```typescript
   const USE_SUPABASE = true; // Set to true
   ```
3. Commit and redeploy

**Pros:**
- ✅ Photos persist across deployments
- ✅ Easy to update photos without redeploying
- ✅ Better for large photo collections

**Cons:**
- ⚠️ Requires Supabase setup (already done!)
- ⚠️ Photos must be uploaded first

### Option B: Bundle Photos with Deployment

1. Keep `USE_SUPABASE = false` in `src/App.tsx`
2. Ensure all photos are in `public/photos/` folder
3. Photos will be included in the build

**Pros:**
- ✅ No external dependencies
- ✅ Works immediately

**Cons:**
- ⚠️ Increases build size
- ⚠️ Must redeploy to change photos
- ⚠️ Not ideal for frequent photo updates

## 🔧 Post-Deployment Configuration

### 1. Test Your Deployed Site

Visit your Netlify URL and verify:
- ✅ Christmas tree loads correctly
- ✅ Photos are visible
- ✅ Gesture controls work (allow camera access)
- ✅ Photo uploader works (if using Supabase)

### 2. Custom Domain (Optional)

In Netlify dashboard:
1. Go to Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

### 3. Enable HTTPS

Netlify automatically provides SSL certificates - your site will be served over HTTPS.

## 🐛 Troubleshooting

### Build Fails

**Error: "Build script returned non-zero exit code"**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Photos Not Loading

**If using Supabase:**
- Verify environment variables are set in Netlify
- Check Supabase bucket is public
- Ensure photos are uploaded to Supabase

**If using local photos:**
- Verify photos exist in `public/photos/` folder
- Check `USE_SUPABASE = false` in `src/App.tsx`

### Camera/Gesture Controls Not Working

- Users must grant camera permission
- HTTPS is required for camera access (Netlify provides this)
- Check browser console for errors

## 📊 Build Information

**Expected Build Output:**
- Build time: ~1-2 minutes
- Bundle size: ~500 KB (gzipped)
- With photos: ~15-20 MB (if bundled)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── photos/ (if bundled)
```

## 🎄 Your Deployment is Ready!

Everything is configured and ready to deploy to Netlify. Choose your deployment method above and get started!

**Quick Deploy Commands:**
```bash
# Build locally to test
npm run build

# Preview the build
npm run preview

# Deploy with Netlify CLI
netlify deploy --prod
```

---

**Need Help?** 
- Netlify Docs: https://docs.netlify.com/
- Supabase Setup: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Merry Christmas! 🎅✨
