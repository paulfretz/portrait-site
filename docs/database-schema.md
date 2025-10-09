# Database Schema Design - DJ Coveno Portraits

**Version:** 1.0  
**Created:** October 9, 2025  
**Database:** PostgreSQL (Supabase)

---

## Overview

This schema supports a portrait photography portfolio website with gallery management, contact inquiries, and editable page content. Designed for a single admin user with public read access.

---

## Tables

### 1. `categories`

Photography categories for organizing galleries (Weddings, Engagements, Portraits, etc.)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID primary key
- `name` - Display name (e.g., "Weddings", "Engagements")
- `slug` - URL-friendly version (e.g., "weddings", "engagements")
- `description` - Optional category description
- `display_order` - Integer for custom sorting (lower = higher priority)
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

**Indexes:**
- Primary key on `id`
- Unique constraint on `name`
- Unique constraint on `slug`
- Index on `display_order` for sorting

**Example Data:**
```
id: uuid
name: "Weddings"
slug: "weddings"
description: "Wedding photography in Montana"
display_order: 1
```

---

### 2. `galleries`

Individual gallery entries with metadata

```sql
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  client_name TEXT NOT NULL,
  cover_image_id UUID,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);
```

**Fields:**
- `id` - UUID primary key
- `category_id` - Foreign key to categories table
- `title` - Gallery title (e.g., "Smith Wedding - Big Sky")
- `slug` - URL-friendly version (unique within category)
- `description` - Optional rich text description
- `date` - Date of the shoot/event
- `location` - Location text (e.g., "Big Sky, Montana")
- `client_name` - Client name (PRIVATE - not displayed publicly)
- `cover_image_id` - Foreign key to images table (set after images uploaded)
- `display_order` - Integer for custom sorting within category
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

**Indexes:**
- Primary key on `id`
- Foreign key index on `category_id`
- Unique compound index on `(category_id, slug)`
- Index on `display_order` for sorting
- Index on `date` for chronological queries

**Example Data:**
```
id: uuid
category_id: [weddings-uuid]
title: "Smith Wedding - Big Sky"
slug: "smith-wedding-big-sky"
description: "Beautiful mountain wedding..."
date: 2024-07-15
location: "Big Sky Resort, Montana"
client_name: "John & Jane Smith" (PRIVATE)
cover_image_id: [image-uuid]
display_order: 1
```

---

### 3. `images`

Photos within galleries

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID primary key
- `gallery_id` - Foreign key to galleries table
- `url` - Full URL to image in storage (Vercel Blob or Cloudflare R2)
- `alt_text` - Accessibility text (auto-generated, can be customized)
- `width` - Image width in pixels
- `height` - Image height in pixels
- `display_order` - Integer for custom sorting within gallery
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

**Indexes:**
- Primary key on `id`
- Foreign key index on `gallery_id`
- Index on `display_order` for sorting

**Notes:**
- Images are stored in external storage (Vercel Blob/Cloudflare R2)
- Multiple responsive sizes generated at upload time
- URL points to optimized web version

**Example Data:**
```
id: uuid
gallery_id: [gallery-uuid]
url: "https://blob.vercel-storage.com/..."
alt_text: "Bride and groom at Big Sky Resort"
width: 2400
height: 1600
display_order: 1
```

---

### 4. `inquiries`

Contact form submissions from potential clients

```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID primary key
- `name` - Client name
- `email` - Client email
- `phone` - Client phone number
- `event_type` - Type of event (Wedding, Engagement, Portrait, Pet, Family, Senior, Proposal, Other)
- `event_date` - Date of event (optional)
- `budget` - Budget range (<$1000, $1000-$2500, $2500-$5000, $5000+, Not Sure)
- `message` - Client message
- `status` - Inquiry status (new, contacted, booked, archived)
- `created_at` - Timestamp when submitted
- `updated_at` - Timestamp when last updated

**Indexes:**
- Primary key on `id`
- Index on `status` for filtering
- Index on `created_at` for chronological sorting
- Index on `email` for search

**Status Values:**
- `new` - Just submitted
- `contacted` - Admin has reached out
- `booked` - Client booked
- `archived` - Closed/no longer active

**Example Data:**
```
id: uuid
name: "Emily Johnson"
email: "emily@example.com"
phone: "406-555-0123"
event_type: "Wedding"
event_date: 2025-06-15
budget: "$2500-$5000"
message: "Looking for wedding photographer..."
status: "new"
```

---

### 5. `page_content`

Editable page content for inline editing (About, Contact, Homepage)

```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page, section)
);
```

**Fields:**
- `id` - UUID primary key
- `page` - Page identifier (home, about, contact)
- `section` - Section identifier (hero_headline, bio, hours, etc.)
- `content` - The actual content (text, HTML, or JSON)
- `content_type` - Type of content (text, html, markdown, json)
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

**Indexes:**
- Primary key on `id`
- Unique compound index on `(page, section)`

**Example Data:**
```
Homepage:
  - page: "home", section: "hero_headline", content: "Montana Portrait Photography"
  - page: "home", section: "hero_subheadline", content: "Capturing life's moments..."

About:
  - page: "about", section: "bio", content: "<p>DJ Coveno is a...</p>"
  - page: "about", section: "experience", content: "10+ years..."
  - page: "about", section: "philosophy", content: "I believe..."

Contact:
  - page: "contact", section: "hours", content: "Available 7 days/week"
  - page: "contact", section: "service_area", content: "Bozeman, Big Sky..."
  - page: "contact", section: "social_instagram", content: "https://instagram.com/..."
```

---

## Relationships

### One-to-Many Relationships

1. **categories → galleries**
   - One category has many galleries
   - Each gallery belongs to one category
   - ON DELETE CASCADE (deleting category deletes its galleries)

2. **galleries → images**
   - One gallery has many images
   - Each image belongs to one gallery
   - ON DELETE CASCADE (deleting gallery deletes its images)

### Self-Referencing Relationships

3. **galleries → images (cover_image)**
   - Each gallery has one cover image (selected from its images)
   - Foreign key `cover_image_id` references images table
   - Set AFTER images are uploaded
   - ON DELETE SET NULL (deleting cover image doesn't delete gallery)

---

## Constraints & Business Rules

1. **Unique Slugs:**
   - Category slugs are globally unique
   - Gallery slugs are unique within their category
   - Allows same slug across different categories

2. **Display Order:**
   - All tables with `display_order` default to 0
   - Lower numbers appear first
   - Allows custom sorting independent of creation order

3. **Timestamps:**
   - All tables have `created_at` and `updated_at`
   - `created_at` is immutable (set once)
   - `updated_at` should be updated on every modification

4. **Cascade Deletes:**
   - Deleting a category deletes all its galleries
   - Deleting a gallery deletes all its images
   - This maintains referential integrity

5. **Client Privacy:**
   - `client_name` in galleries is PRIVATE
   - Should never be exposed in public API responses
   - Only visible to authenticated admin users

---

## Row-Level Security (RLS) Policies

All tables will have RLS enabled with the following policies:

### Public Read Access
- **Categories:** All rows readable by anyone
- **Galleries:** All rows readable by anyone (except `client_name`)
- **Images:** All rows readable by anyone
- **Inquiries:** NO public read access
- **Page Content:** All rows readable by anyone

### Admin Write Access
- All tables: Full CRUD access for authenticated users
- Authenticated via Supabase Auth session

### Example Policy (categories):
```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## Indexes for Performance

```sql
-- Categories
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Galleries
CREATE INDEX idx_galleries_category_id ON galleries(category_id);
CREATE INDEX idx_galleries_display_order ON galleries(display_order);
CREATE INDEX idx_galleries_date ON galleries(date DESC);

-- Images
CREATE INDEX idx_images_gallery_id ON images(gallery_id);
CREATE INDEX idx_images_display_order ON images(display_order);

-- Inquiries
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_email ON inquiries(email);

-- Page Content
-- Unique index on (page, section) already provides lookup performance
```

---

## Migration Strategy

1. Create tables in order (respecting foreign key dependencies)
2. Add indexes
3. Enable RLS on all tables
4. Create RLS policies
5. Seed initial data (categories, page_content defaults)

---

## Future Considerations

Potential additions for future versions:
- `tags` table for flexible photo tagging
- `comments` table for client feedback (if needed)
- `sessions` table for gallery sharing (if private galleries added)
- `analytics` table for tracking inquiries/visits
- Soft deletes (adding `deleted_at` column instead of hard deletes)

---

## Notes

- All tables use UUID primary keys for security and distribution
- Timestamps are in UTC (TIMESTAMPTZ)
- Text fields use TEXT type (unlimited length in PostgreSQL)
- Date fields use DATE type (no time component needed for events)
- Foreign keys use CASCADE for related data cleanup
- Schema designed for single admin, public portfolio use case
- Client names are stored but not publicly exposed

