/**
 * Database Query Functions
 * Reusable functions for common database operations
 *
 * These functions provide a clean API for interacting with the database
 * and can be used from API routes, Server Components, and Server Actions
 *
 * NOTE: This file contains @ts-ignore comments and 'any' types as a workaround
 * for Supabase type inference issues with hand-crafted Database types.
 * This will be resolved in Task 10.22 when we set up Supabase CLI to auto-generate types.
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/lib/supabase/server';
import type {
  Category,
  Gallery,
  GalleryPublic,
  Image,
  Inquiry,
  PageContent,
  CategoryWithGalleries,
  GalleryWithCategory,
  GalleryWithImages,
  GalleryWithAll,
  CategoryInsert,
  GalleryInsert,
  ImageInsert,
  InquiryInsert,
  PageContentInsert,
} from './types';

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories ordered by display_order
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

/**
 * Get category with its galleries
 */
export async function getCategoryWithGalleries(
  slug: string
): Promise<CategoryWithGalleries | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      *,
      galleries (
        id,
        title,
        slug,
        description,
        date,
        location,
        cover_image_id,
        display_order,
        created_at,
        updated_at
      )
    `
    )
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as CategoryWithGalleries;
}

/**
 * Create a new category
 */
export async function createCategory(category: CategoryInsert): Promise<Category> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .insert(category as any)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

/**
 * Update a category
 */
export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

/**
 * Delete a category (cascades to galleries and images)
 */
export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// GALLERIES
// ============================================================================

/**
 * Get all galleries (public-safe, excludes client_name)
 */
export async function getGalleriesPublic(): Promise<GalleryPublic[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('galleries')
    .select(
      'id, category_id, title, slug, description, date, location, cover_image_id, display_order, created_at, updated_at'
    )
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get galleries by category (public-safe)
 */
export async function getGalleriesByCategory(categorySlug: string): Promise<GalleryPublic[]> {
  const supabase = await createClient();

  // First get the category ID
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const { data, error } = await supabase
    .from('galleries')
    .select(`
      id,
      category_id,
      title,
      slug,
      description,
      date,
      location,
      cover_image_id,
      display_order,
      created_at,
      updated_at,
      images!cover_image_id(url)
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('date', { ascending: false });

  if (error) throw error;
  
  // Transform the data to match GalleryPublic type
  return (data || []).map((gallery: any) => ({
    id: gallery.id,
    category_id: gallery.category_id,
    title: gallery.title,
    slug: gallery.slug,
    description: gallery.description,
    date: gallery.date,
    location: gallery.location,
    cover_image_id: gallery.cover_image_id,
    display_order: gallery.display_order,
    created_at: gallery.created_at,
    updated_at: gallery.updated_at,
    cover_image_url: gallery.images?.url || null,
    category_slug: categorySlug,
  }));
}

/**
 * Get gallery by category slug and gallery slug (public-safe)
 */
export async function getGalleryBySlug(
  categorySlug: string,
  gallerySlug: string
): Promise<GalleryWithCategory | null> {
  const supabase = await createClient();

  // Get category first
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const { data, error } = await supabase
    .from('galleries')
    .select(
      `
      id,
      category_id,
      title,
      slug,
      description,
      date,
      location,
      cover_image_id,
      display_order,
      created_at,
      updated_at,
      category:categories(*)
    `
    )
    .eq('category_id', category.id)
    .eq('slug', gallerySlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as GalleryWithCategory;
}

/**
 * Get gallery with all images (public-safe)
 */
export async function getGalleryWithImages(
  categorySlug: string,
  gallerySlug: string
): Promise<GalleryWithImages | null> {
  const supabase = await createClient();

  // Get category first
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const { data, error } = await supabase
    .from('galleries')
    .select(
      `
      id,
      category_id,
      title,
      slug,
      description,
      date,
      location,
      cover_image_id,
      display_order,
      created_at,
      updated_at,
      images (*)
    `
    )
    .eq('category_id', category.id)
    .eq('slug', gallerySlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  // Sort images by display_order
  const gallery = data as GalleryWithImages;
  if (gallery.images) {
    gallery.images.sort((a, b) => a.display_order - b.display_order);
  }

  return gallery;
}

/**
 * Get gallery with category, images, and cover image (public-safe)
 */
export async function getGalleryComplete(
  categorySlug: string,
  gallerySlug: string
): Promise<GalleryWithAll | null> {
  const supabase = await createClient();

  // Get category first
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const { data, error } = await supabase
    .from('galleries')
    .select(
      `
      id,
      category_id,
      title,
      slug,
      description,
      date,
      location,
      cover_image_id,
      display_order,
      created_at,
      updated_at,
      category:categories(*),
      images(*),
      cover_image:images!galleries_cover_image_id_fkey(*)
    `
    )
    .eq('category_id', category.id)
    .eq('slug', gallerySlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  // Sort images by display_order
  const gallery = data as GalleryWithAll;
  if (gallery.images) {
    gallery.images.sort((a, b) => a.display_order - b.display_order);
  }

  return gallery;
}

/**
 * Get gallery by ID (admin - includes client_name)
 */
export async function getGalleryById(id: string): Promise<Gallery | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('galleries').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Create a new gallery
 */
export async function createGallery(gallery: GalleryInsert): Promise<Gallery> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('galleries')
    .insert(gallery as any)
    .select()
    .single();

  if (error) throw error;
  return data as Gallery;
}

/**
 * Update a gallery
 */
export async function updateGallery(id: string, updates: Partial<Gallery>): Promise<Gallery> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('galleries')
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Gallery;
}

/**
 * Delete a gallery (cascades to images)
 */
export async function deleteGallery(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('galleries').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// IMAGES
// ============================================================================

/**
 * Get all images for a gallery
 */
export async function getImagesByGallery(galleryId: string): Promise<Image[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get image by ID
 */
export async function getImageById(id: string): Promise<Image | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('images').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Create a new image
 */
export async function createImage(image: ImageInsert): Promise<Image> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    .insert(image as any)
    .select()
    .single();

  if (error) throw error;
  return data as Image;
}

/**
 * Create multiple images
 */
export async function createImages(images: ImageInsert[]): Promise<Image[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    .insert(images as any)
    .select();

  if (error) throw error;
  return data as Image[];
}

/**
 * Update an image
 */
export async function updateImage(id: string, updates: Partial<Image>): Promise<Image> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Image;
}

/**
 * Delete an image
 */
export async function deleteImage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('images').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Update display order for multiple images
 */
export async function reorderImages(
  imageOrders: { id: string; display_order: number }[]
): Promise<void> {
  const supabase = await createClient();

  // Update each image's display_order
  const updates = imageOrders.map(({ id, display_order }) =>
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    supabase.from('images').update({ display_order }).eq('id', id)
  );

  const results = await Promise.all(updates);

  // Check for errors
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw errors[0].error;
  }
}

// ============================================================================
// INQUIRIES
// ============================================================================

/**
 * Get all inquiries (admin only)
 */
export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get inquiries filtered by status
 */
export async function getInquiriesByStatus(status: string): Promise<Inquiry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get inquiry by ID
 */
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('inquiries').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Create a new inquiry (public can call this)
 */
export async function createInquiry(inquiry: InquiryInsert): Promise<Inquiry> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry as any)
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

/**
 * Update inquiry status (admin only)
 */
export async function updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

/**
 * Delete an inquiry
 */
export async function deleteInquiry(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('inquiries').delete().eq('id', id);

  if (error) throw error;
}

// ============================================================================
// PAGE CONTENT
// ============================================================================

/**
 * Get page content by page and section
 */
export async function getPageContent(page: string, section: string): Promise<PageContent | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', page)
    .eq('section', section)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Get all content for a page
 */
export async function getPageContents(page: string): Promise<PageContent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('page_content').select('*').eq('page', page);

  if (error) throw error;
  return data || [];
}

/**
 * Update or create page content (upsert)
 */
export async function upsertPageContent(content: PageContentInsert): Promise<PageContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    .upsert(content as any, {
      onConflict: 'page,section',
    })
    .select()
    .single();

  if (error) throw error;
  return data as PageContent;
}

/**
 * Update page content
 */
export async function updatePageContent(
  page: string,
  section: string,
  content: string
): Promise<PageContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    // @ts-ignore - Supabase type inference issue, will fix with CLI-generated types
    .update({ content })
    .eq('page', page)
    .eq('section', section)
    .select()
    .single();

  if (error) throw error;
  return data as PageContent;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a slug is unique within a category
 */
export async function isGallerySlugUnique(
  categoryId: string,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase
    .from('galleries')
    .select('id')
    .eq('category_id', categoryId)
    .eq('slug', slug);

  // Exclude current gallery when updating
  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return !data || data.length === 0;
}

/**
 * Check if a category slug is unique
 */
export async function isCategorySlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase.from('categories').select('id').eq('slug', slug);

  // Exclude current category when updating
  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return !data || data.length === 0;
}

/**
 * Get all images for a specific gallery
 */
export async function getImagesByGalleryId(galleryId: string): Promise<Image[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================================================
// DASHBOARD STATS QUERIES
// ============================================================================

/**
 * Get total count of galleries
 */
export async function getGalleryCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('galleries')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

/**
 * Get total count of categories
 */
export async function getCategoryCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

/**
 * Get total count of images
 */
export async function getImageCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('images')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

/**
 * Get count of new inquiries (status = 'new')
 */
export async function getNewInquiryCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) throw error;
  return count || 0;
}

/**
 * Get recently updated galleries (last 5)
 */
export async function getRecentGalleries(): Promise<Gallery[]> {
  const supabase = await createClient();
  // @ts-ignore
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}

