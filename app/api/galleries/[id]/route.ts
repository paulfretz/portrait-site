import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getGalleryById,
  updateGallery,
  deleteGallery,
  generateSlug,
  isGallerySlugUnique,
} from '@/lib/db/queries';
import type { Gallery } from '@/lib/db/types';

type Params = {
  params: {
    id: string;
  };
};

/**
 * GET /api/galleries/[id]
 * Get a single gallery by ID
 * Public endpoint - no authentication required
 * NOTE: client_name is excluded from response for privacy
 *
 * @returns Gallery data (without client_name)
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Get gallery by ID (admin function - includes client_name)
    const gallery = await getGalleryById(id);

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gallery not found',
        },
        { status: 404 }
      );
    }

    // Remove client_name for privacy
    const { client_name: _, ...publicGallery } = gallery;

    return NextResponse.json({
      success: true,
      data: publicGallery,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/galleries/[id]
 * Update a gallery
 * Admin only - requires authentication
 *
 * Request body (all fields optional for partial updates):
 * {
 *   category_id?: string
 *   title?: string
 *   description?: string
 *   date?: string (YYYY-MM-DD)
 *   location?: string
 *   client_name?: string
 *   cover_image_id?: string
 *   display_order?: number
 * }
 *
 * @returns Updated gallery (excluding client_name)
 */
export async function PUT(request: NextRequest, { params }: Params) {
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

    const { id } = params;

    // Check if gallery exists
    const existingGallery = await getGalleryById(id);
    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gallery not found',
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      category_id,
      title,
      description,
      date,
      location,
      client_name,
      cover_image_id,
      display_order,
    } = body;

    // Build updates object
    const updates: Partial<Gallery> = {};

    // Validate and add category_id
    if (category_id !== undefined) {
      if (typeof category_id !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Category ID must be a string',
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

      updates.category_id = category_id;
    }

    // Validate and add title (regenerates slug if changed)
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Title must be a non-empty string',
          },
          { status: 400 }
        );
      }

      updates.title = title.trim();

      // Generate new slug
      const newSlug = generateSlug(title);

      // Check if new slug is unique within category (excluding current gallery)
      const targetCategoryId = category_id || existingGallery.category_id;
      const isUnique = await isGallerySlugUnique(targetCategoryId, newSlug, id);

      if (!isUnique) {
        return NextResponse.json(
          {
            success: false,
            error: 'A gallery with this title already exists in this category',
          },
          { status: 409 }
        );
      }

      updates.slug = newSlug;
    }

    // Validate and add description
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    // Validate and add date
    if (date !== undefined) {
      if (typeof date !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Date must be a string',
          },
          { status: 400 }
        );
      }

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

      updates.date = date;
    }

    // Validate and add location
    if (location !== undefined) {
      if (typeof location !== 'string' || location.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Location must be a non-empty string',
          },
          { status: 400 }
        );
      }
      updates.location = location.trim();
    }

    // Validate and add client_name
    if (client_name !== undefined) {
      if (typeof client_name !== 'string' || client_name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Client name must be a non-empty string',
          },
          { status: 400 }
        );
      }
      updates.client_name = client_name.trim();
    }

    // Validate and add cover_image_id
    if (cover_image_id !== undefined) {
      if (cover_image_id !== null && typeof cover_image_id !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Cover image ID must be a string or null',
          },
          { status: 400 }
        );
      }

      // Verify image exists and belongs to this gallery
      if (cover_image_id) {
        const { data: imageExists } = await supabase
          .from('images')
          .select('id')
          .eq('id', cover_image_id)
          .eq('gallery_id', id)
          .single();

        if (!imageExists) {
          return NextResponse.json(
            {
              success: false,
              error: 'Cover image not found or does not belong to this gallery',
            },
            { status: 404 }
          );
        }
      }

      updates.cover_image_id = cover_image_id;
    }

    // Validate and add display_order
    if (display_order !== undefined) {
      if (typeof display_order !== 'number') {
        return NextResponse.json(
          {
            success: false,
            error: 'Display order must be a number',
          },
          { status: 400 }
        );
      }
      updates.display_order = display_order;
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields to update',
        },
        { status: 400 }
      );
    }

    // Update gallery
    const updatedGallery = await updateGallery(id, updates);

    // Remove client_name from response
    const { client_name: _, ...publicGallery } = updatedGallery;

    return NextResponse.json({
      success: true,
      data: publicGallery,
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update gallery',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/galleries/[id]
 * Delete a gallery
 * Admin only - requires authentication
 * WARNING: This cascades to all images in the gallery
 *
 * @returns Success message
 */
export async function DELETE(request: NextRequest, { params }: Params) {
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

    const { id } = params;

    // Check if gallery exists
    const gallery = await getGalleryById(id);
    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gallery not found',
        },
        { status: 404 }
      );
    }

    // Delete gallery (cascades to images)
    await deleteGallery(id);

    return NextResponse.json({
      success: true,
      message: 'Gallery deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete gallery',
      },
      { status: 500 }
    );
  }
}
