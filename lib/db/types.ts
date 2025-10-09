/**
 * Database types for Supabase
 * Generated from database schema (supabase/migrations/001_initial_schema.sql)
 *
 * These types match the PostgreSQL schema and provide type safety for:
 * - Supabase queries
 * - API route handlers
 * - Database operations
 */

// ============================================================================
// JSON Type Helper
// ============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ============================================================================
// Enums
// ============================================================================

export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'archived';

export type ContentType = 'text' | 'html' | 'markdown' | 'json';

export type EventType =
  | 'Wedding'
  | 'Engagement'
  | 'Portrait'
  | 'Pet'
  | 'Family'
  | 'Senior'
  | 'Proposal'
  | 'Other';

export type BudgetRange = '<$1000' | '$1000-$2500' | '$2500-$5000' | '$5000+' | 'Not Sure';

// ============================================================================
// Table Types
// ============================================================================

// ----------------------------------------------------------------------------
// Categories
// ----------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  display_order?: number;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// Galleries
// ----------------------------------------------------------------------------

export interface Gallery {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string | null;
  date: string; // Date string in ISO format
  location: string;
  client_name: string; // PRIVATE - not exposed in public APIs
  cover_image_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryInsert {
  id?: string;
  category_id: string;
  title: string;
  slug: string;
  description?: string | null;
  date: string;
  location: string;
  client_name: string;
  cover_image_id?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryUpdate {
  id?: string;
  category_id?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  date?: string;
  location?: string;
  client_name?: string;
  cover_image_id?: string | null;
  display_order?: number;
  updated_at?: string;
}

// Public-safe gallery type (excludes client_name)
export type GalleryPublic = Omit<Gallery, 'client_name'>;

// ----------------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------------

export interface Image {
  id: string;
  gallery_id: string;
  url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ImageInsert {
  id?: string;
  gallery_id: string;
  url: string;
  alt_text?: string | null;
  width?: number | null;
  height?: number | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ImageUpdate {
  id?: string;
  gallery_id?: string;
  url?: string;
  alt_text?: string | null;
  width?: number | null;
  height?: number | null;
  display_order?: number;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// Inquiries
// ----------------------------------------------------------------------------

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  event_date: string | null; // Date string in ISO format
  budget: BudgetRange | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface InquiryInsert {
  id?: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  event_date?: string | null;
  budget?: BudgetRange | null;
  message: string;
  status?: InquiryStatus;
  created_at?: string;
  updated_at?: string;
}

export interface InquiryUpdate {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  event_type?: EventType;
  event_date?: string | null;
  budget?: BudgetRange | null;
  message?: string;
  status?: InquiryStatus;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// Page Content
// ----------------------------------------------------------------------------

export interface PageContent {
  id: string;
  page: string;
  section: string;
  content: string;
  content_type: ContentType;
  created_at: string;
  updated_at: string;
}

export interface PageContentInsert {
  id?: string;
  page: string;
  section: string;
  content: string;
  content_type?: ContentType;
  created_at?: string;
  updated_at?: string;
}

export interface PageContentUpdate {
  id?: string;
  page?: string;
  section?: string;
  content?: string;
  content_type?: ContentType;
  updated_at?: string;
}

// ============================================================================
// Database Type (Supabase Format)
// ============================================================================

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      galleries: {
        Row: Gallery;
        Insert: GalleryInsert;
        Update: GalleryUpdate;
      };
      images: {
        Row: Image;
        Insert: ImageInsert;
        Update: ImageUpdate;
      };
      inquiries: {
        Row: Inquiry;
        Insert: InquiryInsert;
        Update: InquiryUpdate;
      };
      page_content: {
        Row: PageContent;
        Insert: PageContentInsert;
        Update: PageContentUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      inquiry_status: InquiryStatus;
      content_type: ContentType;
      event_type: EventType;
      budget_range: BudgetRange;
    };
  };
};

// ============================================================================
// Helper Types
// ============================================================================

// Gallery with related data
export interface GalleryWithCategory extends Gallery {
  category: Category;
}

export interface GalleryWithImages extends Gallery {
  images: Image[];
}

export interface GalleryWithAll extends Gallery {
  category: Category;
  images: Image[];
  cover_image: Image | null;
}

// Category with galleries
export interface CategoryWithGalleries extends Category {
  galleries: Gallery[];
}

// Utility type for database operations
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
