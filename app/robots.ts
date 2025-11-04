/**
 * Robots.txt Generator
 * 
 * Configures how search engine crawlers should interact with the site.
 * This file allows all major search engines to crawl all pages and
 * points them to the sitemap for efficient indexing.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://djcoveno.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/image-sitemap.xml`, // Image sitemap for Google Images
    ],
  };
}

