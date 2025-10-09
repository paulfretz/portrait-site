import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getImagesByGalleryId } from '@/lib/db/queries';

/**
 * GET /api/galleries/[id]/images
 * Get all images for a gallery
 * Public endpoint - no authentication required
 *
 * @param id - Gallery ID (UUID)
 *
 * Response:
 * - 200: Image[] ordered by display_order
 * - 400: { error: 'Invalid gallery ID' }
 * - 500: { error: string }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid gallery ID',
        },
        { status: 400 }
      );
    }

    // Fetch images
    const images = await getImagesByGalleryId(id);

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch images',
      },
      { status: 500 }
    );
  }
}

