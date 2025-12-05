import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vtlktcygurszmyflbpll.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bGt0Y3lndXJzem15ZmxicGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDc5MDYsImV4cCI6MjA1NjUyMzkwNn0.h_G94Yhdzsn1NoLffxP5jYX3SWR5VWQQrFKt8HxrV_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a photo to Supabase Storage
 * @param file - The file to upload
 * @param fileName - The name to save the file as (e.g., 'top.jpg', '1.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadPhoto(file: File, fileName: string): Promise<string> {
  const { error } = await supabase.storage
    .from('christmas-tree-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('christmas-tree-photos')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Delete a photo from Supabase Storage
 * @param fileName - The name of the file to delete
 */
export async function deletePhoto(fileName: string): Promise<void> {
  const { error } = await supabase.storage
    .from('christmas-tree-photos')
    .remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List all photos in the bucket
 */
export async function listPhotos(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('christmas-tree-photos')
    .list();

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data.map((file) => file.name);
}

/**
 * Get the public URL for a photo
 * @param fileName - The name of the file
 */
export function getPhotoUrl(fileName: string): string {
  const { data } = supabase.storage
    .from('christmas-tree-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
