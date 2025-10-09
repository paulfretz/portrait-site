import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getGalleriesPublic,
  createGallery,
  generateSlug,
  isGallerySlugUnique,
} from '@/lib/db/queries';
import type { GalleryInsert } from '@/lib/db/types';

/**
 * GET /api/galleries
 * Get all galleries (public-safe, excludes client_name)
 * Public endpoint - no authentication required
 *
 * Query parameters:
 * - category: Filter by category slug (optional)
 *
 * @returns Array of galleries ordered by display_order
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');

    // If category filter provided, use category-specific query
    if (categorySlug) {
      const { getGalleriesByCategory } = await import('@/lib/db/queries');
      const galleries = await getGalleriesByCategory(categorySlug);

      return NextResponse.json({
        success: true,
        data: galleries,
      });
    }

    // Otherwise get all galleries
    const galleries = await getGalleriesPublic();

    return NextResponse.json({
      success: true,
      data: galleries,
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch galleries',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/galleries
 * Create a new gallery
 * Admin only - requires authentication
 *
 * Request body:
 * {
 *   category_id: string (required)
 *   title: string (required)
 *   description?: string
 *   date: string (required, ISO date format YYYY-MM-DD)
 *   location: string (required)
 *   client_name: string (required, private)
 *   display_order?: number
 * }
 *
 * @returns Created gallery (excluding client_name)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - admin access required',
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { category_id, title, description, date, location, client_name, display_order } = body;

    // Validate required fields
    if (!category_id || typeof category_id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Category ID is required',
        },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Date is required (format: YYYY-MM-DD)',
        },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD',
        },
        { status: 400 }
      );
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Location is required',
        },
        { status: 400 }
      );
    }

    if (!client_name || typeof client_name !== 'string' || client_name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client name is required',
        },
        { status: 400 }
      );
    }

    // Verify category exists
    const { data: categoryExists } = await supabase
      .from('categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Check if slug is unique within the category
    const isUnique = await isGallerySlugUnique(category_id, slug);
    if (!isUnique) {
      return NextResponse.json(
        {
          success: false,
          error: 'A gallery with this title already exists in this category',
        },
        { status: 409 }
      );
    }

    // Create gallery
    const galleryData: GalleryInsert = {
      category_id,
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      date,
      location: location.trim(),
      client_name: client_name.trim(),
      display_order: display_order ?? 0,
    };

    const gallery = await createGallery(galleryData);

    // Remove client_name from response (keep it private)
    const { client_name: _, ...publicGallery } = gallery;

    return NextResponse.json(
      {
        success: true,
        data: publicGallery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create gallery',
      },
      { status: 500 }
    );
  }
}
