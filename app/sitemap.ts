/**
 * Dynamic Sitemap Generator
 * 
 * Generates a sitemap.xml file that includes:
 * - Static pages (home, about, contact, galleries overview)
 * - Dynamic category pages
 * - Dynamic gallery pages
 * 
 * This helps search engines discover and index all pages on the site.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { getAllCategories, getAllGalleries } from '@/lib/db/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://djcoveno.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all categories and galleries from the database
    const [categories, galleries] = await Promise.all([
      getAllCategories(),
      getAllGalleries(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/galleries`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${SITE_URL}/galleries/${category.slug}`,
      lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Gallery pages
    const galleryPages: MetadataRoute.Sitemap = galleries.map((gallery) => ({
      url: `${SITE_URL}/galleries/${gallery.category_slug}/${gallery.slug}`,
      lastModified: gallery.updated_at ? new Date(gallery.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Combine all pages
    return [...staticPages, ...categoryPages, ...galleryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ];
  }
}

