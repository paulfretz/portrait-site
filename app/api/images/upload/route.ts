import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { createClient } from '@/lib/supabase/server';
import { createImage } from '@/lib/db/queries';
import type { ImageInsert } from '@/lib/db/types';
import { optimizeImage, generateOptimizedFilename } from '@/lib/utils/image-optimizer';

/**
 * POST /api/images/upload
 * Upload one or more images to Vercel Blob and save metadata to database
 * Admin only - requires authentication
 *
 * Request:
 * - Content-Type: multipart/form-data
 * - Files: images[] (JPEG/PNG/WebP/HEIC, max 10MB each)
 * - Fields:
 *   - gallery_id: string (required)
 *   - alt_text_override?: string (optional, for single image)
 *
 * Response:
 * - 200: { success: true, images: Image[] }
 * - 400: { success: false, error: string }
 * - 401: { success: false, error: 'Unauthorized' }
 * - 500: { success: false, error: string }
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

    // Parse form data
    const formData = await request.formData();
    const galleryId = formData.get('gallery_id') as string;
    const altTextOverride = formData.get('alt_text_override') as string | null;

    // Validate gallery_id
    if (!galleryId || typeof galleryId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'gallery_id is required',
        },
        { status: 400 }
      );
    }

    // Verify gallery exists
    const { getGalleryById } = await import('@/lib/db/queries');
    const gallery = await getGalleryById(galleryId);
    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gallery not found',
        },
        { status: 404 }
      );
    }

    // Get all uploaded files
    const files: File[] = [];
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key === 'images' && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No images provided',
        },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, HEIC`,
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} is too large. Maximum size: 10MB`,
          },
          { status: 400 }
        );
      }
    }

    // Upload files to Vercel Blob and save metadata
    const uploadedImages = [];

    for (const file of files) {
      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Optimize image and generate multiple sizes
        const optimized = await optimizeImage(buffer);

        // Upload all optimized versions to Vercel Blob
        const uploadPromises = optimized.sizes.map(async (size) => {
          const filename = generateOptimizedFilename(file.name, size.name, size.format);
          const path = `galleries/${galleryId}/${Date.now()}-${filename}`;
          
          return await put(path, size.buffer, {
            access: 'public',
            addRandomSuffix: true,
          });
        });

        const uploadedBlobs = await Promise.all(uploadPromises);

        // Use the original JPEG as the main URL (last uploaded)
        const originalJpegBlob = uploadedBlobs.find((blob) => 
          blob.pathname.includes('-original.jpeg')
        ) || uploadedBlobs[0];

        // Generate alt text from gallery title and location
        const altText =
          altTextOverride ||
          `${gallery.title}${gallery.location ? ` in ${gallery.location}` : ''}`;

        // Save to database with actual dimensions
        const imageData: ImageInsert = {
          gallery_id: galleryId,
          url: originalJpegBlob.url,
          alt_text: altText,
          width: optimized.originalDimensions.width,
          height: optimized.originalDimensions.height,
          display_order: 0, // Will be updated when reordering is implemented
        };

        const savedImage = await createImage(imageData);
        uploadedImages.push(savedImage);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        // Continue with other files even if one fails
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload any images',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} of ${files.length} images`,
    });
  } catch (error) {
    console.error('Error in image upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload images',
      },
      { status: 500 }
    );
  }
}

// Configure runtime for Next.js API route
export const runtime = 'nodejs';

