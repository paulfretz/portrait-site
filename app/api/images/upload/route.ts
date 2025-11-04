import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
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
 * - Files: images[] (JPEG/PNG/WebP/HEIC, max 50MB each, up to 8000px)
 * - Fields:
 *   - gallery_id: string (required)
 *   - alt_text_override?: string (optional, for single image)
 *
 * Response:
 * - 200: { success: true, images: Image[] }
 * - 400: { success: false, error: string } (invalid file type, size >50MB, or missing gallery_id)
 * - 401: { success: false, error: 'Unauthorized' }
 * - 404: { success: false, error: 'Gallery not found' }
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
    const maxSize = 50 * 1024 * 1024; // 50MB (for high-resolution professional photography)

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
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" is too large (${fileSizeMB}MB). Maximum size: 50MB`,
          },
          { status: 400 }
        );
      }
    }

    // Validate image dimensions (max 8000px width or height)
    const maxDimension = 8000; // 8000px for professional high-res photography
    
    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const metadata = await sharp(Buffer.from(buffer)).metadata();
        
        if (!metadata.width || !metadata.height) {
          return NextResponse.json(
            {
              success: false,
              error: `Could not read dimensions of "${file.name}". File may be corrupted.`,
            },
            { status: 400 }
          );
        }

        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          return NextResponse.json(
            {
              success: false,
              error: `Image "${file.name}" dimensions (${metadata.width}×${metadata.height}px) exceed maximum (${maxDimension}px). Please resize before uploading.`,
            },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error reading image dimensions:', error);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to process "${file.name}". Please ensure it's a valid image file.`,
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
        // Use timestamp to prevent collisions instead of random suffix
        const timestamp = Date.now();
        const uploadPromises = optimized.sizes.map(async (size, index) => {
          const filename = generateOptimizedFilename(file.name, size.name, size.format);
          const path = `galleries/${galleryId}/${timestamp}-${filename}`;
          
          const blob = await put(path, size.buffer, {
            access: 'public',
            addRandomSuffix: false, // Remove random suffix to allow variant URL generation
          });
          
          // Return both the blob and metadata to track which is original
          return { blob, size, index };
        });

        const uploadResults = await Promise.all(uploadPromises);

        // Find the original JPEG blob by matching size metadata
        const originalJpegResult = uploadResults.find((result) => 
          result.size.name === 'original' && result.size.format === 'jpeg'
        );
        
        if (!originalJpegResult) {
          throw new Error('Failed to find original JPEG after upload');
        }

        const originalJpegBlob = originalJpegResult.blob;

        // Generate alt text from gallery title and location
        const altText =
          altTextOverride ||
          `${gallery.title}${gallery.location ? ` in ${gallery.location}` : ''}`;

        // Save to database with actual dimensions and blur placeholder
        const imageData: ImageInsert = {
          gallery_id: galleryId,
          url: originalJpegBlob.url,
          alt_text: altText,
          width: optimized.originalDimensions.width,
          height: optimized.originalDimensions.height,
          blur_data_url: optimized.blurDataUrl, // Base64 blur placeholder
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

