import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { del } from '@vercel/blob';
import { createClient } from '@/lib/supabase/server';
import { getImageById, deleteImage, updateImage } from '@/lib/db/queries';
import type { ImageUpdate } from '@/lib/db/types';

/**
 * PUT /api/images/[id]
 * Update image metadata (alt_text, display_order, etc.)
 * Admin only - requires authentication
 *
 * @param id - Image ID (UUID)
 *
 * Request body (all fields optional):
 * {
 *   alt_text?: string
 *   display_order?: number
 *   width?: number
 *   height?: number
 * }
 *
 * Response:
 * - 200: { success: true, image: Image }
 * - 401: { success: false, error: 'Unauthorized' }
 * - 404: { success: false, error: 'Image not found' }
 * - 500: { success: false, error: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image ID',
        },
        { status: 400 }
      );
    }

    // Verify image exists
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { alt_text, display_order, width, height } = body;

    // Build update object
    const updates: ImageUpdate = {};
    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (display_order !== undefined) updates.display_order = display_order;
    if (width !== undefined) updates.width = width;
    if (height !== undefined) updates.height = height;

    // Update image
    const updatedImage = await updateImage(id, updates);

    return NextResponse.json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update image',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/images/[id]
 * Partially update image metadata (supports hero image toggles)
 * Admin only - requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image ID',
        },
        { status: 400 }
      );
    }

    const existingImage = await getImageById(id);
    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      alt_text,
      display_order,
      width,
      height,
      blur_data_url,
      is_hero_image,
      hero_display_order,
    } = body;

    const updates: ImageUpdate = {};

    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (display_order !== undefined) updates.display_order = display_order;
    if (width !== undefined) updates.width = width;
    if (height !== undefined) updates.height = height;
    if (blur_data_url !== undefined) updates.blur_data_url = blur_data_url;
    if (is_hero_image !== undefined) updates.is_hero_image = is_hero_image;
    if (hero_display_order !== undefined) updates.hero_display_order = hero_display_order;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields to update',
        },
        { status: 400 }
      );
    }

    const updatedImage = await updateImage(id, updates);

    return NextResponse.json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error('Error patching image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update image',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/images/[id]
 * Delete an image from Vercel Blob and database
 * Admin only - requires authentication
 *
 * @param id - Image ID (UUID)
 *
 * Response:
 * - 200: { success: true, message: string }
 * - 401: { success: false, error: 'Unauthorized' }
 * - 404: { success: false, error: 'Image not found' }
 * - 500: { success: false, error: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image ID',
        },
        { status: 400 }
      );
    }

    // Get image to verify it exists and get the blob URL
    const image = await getImageById(id);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(image.url);
    } catch (blobError) {
      // Log error but continue - blob might already be deleted
      console.warn('Error deleting from blob storage:', blobError);
      // Don't fail the request if blob deletion fails
    }

    // Delete from database
    await deleteImage(id);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete image',
      },
      { status: 500 }
    );
  }
}

