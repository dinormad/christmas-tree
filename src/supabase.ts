import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vtlktcygurszmyflbpll.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bGt0Y3lndXJzem15ZmxicGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDc5MDYsImV4cCI6MjA1NjUyMzkwNn0.h_G94Yhdzsn1NoLffxP5jYX3SWR5VWQQrFKt8HxrV_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a photo to Supabase Storage
 * @param file - The file to upload
 * @param fileName - The name to save the file as (e.g., 'top.jpg', '1.jpg')
 * @param userId - The user's ID for folder isolation
 * @returns The public URL of the uploaded file
 */
export async function uploadPhoto(file: File, fileName: string, userId?: string): Promise<string> {
  // Get current user if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const filePath = `${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('christmas-tree-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('christmas-tree-photos')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Delete a photo from Supabase Storage
 * @param fileName - The name of the file to delete
 * @param userId - The user's ID for folder isolation
 */
export async function deletePhoto(fileName: string, userId?: string): Promise<void> {
  // Get current user if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const filePath = `${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('christmas-tree-photos')
    .remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List all photos in the bucket for current user
 * @param userId - The user's ID for folder isolation
 */
export async function listPhotos(userId?: string): Promise<string[]> {
  // Get current user if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const { data, error } = await supabase.storage
    .from('christmas-tree-photos')
    .list(userId);

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data.map((file) => file.name);
}

/**
 * Get the public URL for a photo
 * @param fileName - The name of the file
 * @param userId - The user's ID for folder isolation
 */
export function getPhotoUrl(fileName: string, userId?: string): string {
  if (!userId) {
    // If no userId provided, return a placeholder
    // This will be replaced when the user logs in
    return `/photos/${fileName}`;
  }

  const filePath = `${userId}/${fileName}`;
  const { data } = supabase.storage
    .from('christmas-tree-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
