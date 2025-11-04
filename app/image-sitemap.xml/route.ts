/**
 * Image Sitemap Generator
 * 
 * Generates an image sitemap (image-sitemap.xml) that includes:
 * - All gallery images with high-res URLs
 * - Image metadata (title, caption, location)
 * - Gallery and category context
 * 
 * This helps search engines discover and index images for Google Images.
 * 
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

import { NextResponse } from 'next/server';
import { getAllGalleries, getImagesByGalleryId } from '@/lib/db/queries';
import { getLightboxImageUrl } from '@/lib/utils/image-urls';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://djcoveno.com';

export async function GET() {
  try {
    // Fetch all galleries
    const galleries = await getAllGalleries();

    // Fetch images for each gallery
    const galleryImagesPromises = galleries.map(async (gallery) => {
      const images = await getImagesByGalleryId(gallery.id);
      return {
        gallery,
        images,
      };
    });

    const galleryImages = await Promise.all(galleryImagesPromises);

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${galleryImages
  .map(({ gallery, images }) =>
    images
      .map((image) => {
        const imageUrl = getLightboxImageUrl(image.url) || image.url;
        const pageUrl = `${SITE_URL}/galleries/${gallery.category_slug}/${gallery.slug}`;
        
        return `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(image.alt_text || gallery.title)}</image:title>
      ${image.alt_text ? `<image:caption>${escapeXml(image.alt_text)}</image:caption>` : ''}
      ${gallery.location ? `<image:geo_location>${escapeXml(gallery.location)}</image:geo_location>` : ''}
    </image:image>
  </url>`;
      })
      .join('\n')
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating image sitemap:', error);
    
    // Return minimal sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}</loc>
  </url>
</urlset>`;

    return new NextResponse(errorXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

