/**
 * SEO Utility Functions
 * Helper functions for generating SEO-optimized meta tags and content
 */

const SITE_NAME = 'DJ Coveno Portraits';
const SITE_TAGLINE = 'Montana Portrait Photography';
const MONTANA_LOCATIONS = ['Big Sky', 'Bozeman', 'Yellowstone', 'Montana'];
const SERVICE_KEYWORDS = [
  'wedding photographer',
  'engagement photos',
  'portrait photographer',
  'family portraits',
  'senior photos',
];

interface PageSEOData {
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  image?: string;
  author?: string;
}

/**
 * Generate full page title with site name
 * Format: "Page Title | DJ Coveno Portraits"
 */
export function generatePageTitle(pageTitle: string): string {
  if (!pageTitle || pageTitle === SITE_NAME) {
    return `${SITE_NAME} - ${SITE_TAGLINE}`;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Generate SEO-optimized meta description with Montana keywords
 */
export function generateMetaDescription(
  baseDescription: string,
  options?: {
    includeLocation?: boolean;
    includeService?: string;
  }
): string {
  let description = baseDescription;

  // Add location context if requested
  if (options?.includeLocation && !description.includes('Montana')) {
    description += ` Serving ${MONTANA_LOCATIONS.slice(0, 3).join(', ')}.`;
  }

  // Add service context if requested
  if (options?.includeService && !description.toLowerCase().includes(options.includeService)) {
    description += ` Professional ${options.includeService} in Montana.`;
  }

  // Truncate to optimal length (150-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  return description;
}

/**
 * Generate keywords array with Montana and service terms
 */
export function generateKeywords(
  customKeywords: string[] = [],
  options?: {
    includeLocation?: boolean;
    includeServices?: boolean;
  }
): string[] {
  const keywords = [...customKeywords];

  if (options?.includeLocation) {
    keywords.push(...MONTANA_LOCATIONS);
  }

  if (options?.includeServices) {
    keywords.push(...SERVICE_KEYWORDS);
  }

  // Remove duplicates
  return Array.from(new Set(keywords));
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://djcovenoportraits.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(data: PageSEOData) {
  return {
    title: data.title,
    description: data.description,
    type: data.type || 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    ...(data.image && { images: [{ url: data.image, alt: data.title }] }),
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(data: PageSEOData) {
  return {
    card: 'summary_large_image',
    title: data.title,
    description: data.description,
    ...(data.image && { images: [data.image] }),
    ...(data.author && { creator: data.author }),
  };
}

/**
 * Generate location-based schema data for local SEO
 */
export function generateLocationData(location?: string) {
  const locations = {
    'Big Sky': {
      name: 'Big Sky, Montana',
      coordinates: { latitude: 45.2847, longitude: -111.3081 },
    },
    Bozeman: {
      name: 'Bozeman, Montana',
      coordinates: { latitude: 45.6797, longitude: -111.0447 },
    },
    Yellowstone: {
      name: 'Yellowstone National Park',
      coordinates: { latitude: 44.428, longitude: -110.5885 },
    },
  };

  if (location && location in locations) {
    return locations[location as keyof typeof locations];
  }

  return {
    name: 'Montana',
    coordinates: { latitude: 46.8797, longitude: -110.3626 },
  };
}

/**
 * Sanitize and validate meta description
 */
export function sanitizeMetaDescription(description: string): string {
  return description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 160); // Max 160 characters
}

/**
 * Generate SEO-optimized alt text for images
 */
export function generateImageAltText(
  subject: string,
  location?: string,
  photographer: string = 'DJ Coveno'
): string {
  const parts = [subject];

  if (location) {
    parts.push(`in ${location}`);
  }

  parts.push(`by ${photographer}`);

  return parts.join(' ');
}

