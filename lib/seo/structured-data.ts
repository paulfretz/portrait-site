/**
 * Structured Data Generators for JSON-LD Schema Markup
 * 
 * Provides functions to generate Schema.org structured data for:
 * - Organization/Person (photographer profile)
 * - ImageObject (gallery images)
 * - ImageGallery (collections)
 * - BreadcrumbList (navigation)
 * - Event (weddings, sessions)
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

import { GalleryPublic, Image, Category } from '@/lib/db/types';
import { getLightboxImageUrl, getThumbnailUrl } from '@/lib/utils/image-urls';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://djcoveno.com';
const BUSINESS_NAME = 'DJ Coveno Portraits';
const PHOTOGRAPHER_NAME = 'DJ Coveno';

/**
 * Organization/Person Schema
 * Represents the photographer and business
 */
interface OrganizationSchemaOptions {
  name?: string;
  description?: string;
  email?: string;
  telephone?: string;
  logo?: string;
  image?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[]; // Social media profiles
}

export function generateOrganizationSchema(
  options: OrganizationSchemaOptions = {}
): object {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: options.name || BUSINESS_NAME,
    description:
      options.description ||
      'Professional portrait photography serving Big Sky, Bozeman, Yellowstone, and Montana. Specializing in weddings, engagements, families, and authentic storytelling.',
    url: SITE_URL,
    logo: options.logo || `${SITE_URL}/images/logo.png`,
    image: options.image || `${SITE_URL}/images/og-default.jpg`,
    telephone: options.telephone,
    email: options.email,
    priceRange: '$$$',
    address: options.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: options.address.streetAddress,
          addressLocality: options.address.addressLocality || 'Big Sky',
          addressRegion: options.address.addressRegion || 'MT',
          postalCode: options.address.postalCode,
          addressCountry: options.address.addressCountry || 'US',
        }
      : undefined,
    areaServed: [
      {
        '@type': 'City',
        name: 'Big Sky',
        '@id': 'https://www.wikidata.org/wiki/Q810307',
      },
      {
        '@type': 'City',
        name: 'Bozeman',
        '@id': 'https://www.wikidata.org/wiki/Q80989',
      },
      {
        '@type': 'Place',
        name: 'Yellowstone National Park',
        '@id': 'https://www.wikidata.org/wiki/Q351',
      },
      {
        '@type': 'State',
        name: 'Montana',
        '@id': 'https://www.wikidata.org/wiki/Q1212',
      },
    ],
    sameAs: options.sameAs || [],
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(schema));
}

/**
 * Person Schema
 * Represents the photographer as an individual
 */
interface PersonSchemaOptions {
  name?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  email?: string;
  telephone?: string;
  sameAs?: string[];
}

export function generatePersonSchema(options: PersonSchemaOptions = {}): object {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: options.name || PHOTOGRAPHER_NAME,
    jobTitle: options.jobTitle || 'Professional Portrait Photographer',
    description:
      options.description ||
      'Award-winning portrait photographer specializing in weddings, engagements, and family photography in Montana.',
    image: options.image || `${SITE_URL}/images/photographer-profile.jpg`,
    url: `${SITE_URL}/about`,
    email: options.email,
    telephone: options.telephone,
    knowsAbout: [
      'Portrait Photography',
      'Wedding Photography',
      'Engagement Photography',
      'Family Photography',
      'Pet Photography',
      'Montana Photography',
    ],
    sameAs: options.sameAs || [],
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * ImageObject Schema
 * Represents individual images with photographer attribution
 */
interface ImageObjectSchemaOptions {
  image: Image;
  gallery?: GalleryPublic;
  category?: Category;
}

export function generateImageObjectSchema(
  options: ImageObjectSchemaOptions
): object {
  const { image, gallery, category } = options;

  // Use high-res xlarge variant (4000px) for contentUrl, thumbnail for thumbnailUrl
  const highResUrl = getLightboxImageUrl(image.url) || image.url;
  const thumbUrl = getThumbnailUrl(image.url) || image.url;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/images/${image.id}`,
    contentUrl: highResUrl, // High-res xlarge variant (4000px WebP)
    thumbnailUrl: thumbUrl, // Thumbnail variant (400px WebP)
    name: image.alt_text || `${gallery?.title || 'Gallery'} - Image ${image.display_order}`,
    description: image.alt_text,
    uploadDate: image.created_at,
    width: image.width ? `${image.width}px` : undefined,
    height: image.height ? `${image.height}px` : undefined,
    encodingFormat: 'image/webp', // WebP for modern browsers
    author: {
      '@type': 'Person',
      name: PHOTOGRAPHER_NAME,
      url: `${SITE_URL}/about`,
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    creator: {
      '@type': 'Person',
      name: PHOTOGRAPHER_NAME,
    },
    isPartOf: gallery
      ? {
          '@type': 'ImageGallery',
          name: gallery.title,
          url: `${SITE_URL}/galleries/${category?.slug}/${gallery.slug}`,
        }
      : undefined,
    contentLocation: gallery?.location
      ? {
          '@type': 'Place',
          name: gallery.location,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'MT',
            addressCountry: 'US',
          },
        }
      : undefined,
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * ImageGallery Schema
 * Represents a collection of images (gallery page)
 */
interface ImageGallerySchemaOptions {
  gallery: GalleryPublic;
  category?: Category;
  images?: Image[];
}

export function generateImageGallerySchema(
  options: ImageGallerySchemaOptions
): object {
  const { gallery, category, images } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${SITE_URL}/galleries/${category?.slug}/${gallery.slug}`,
    name: gallery.title,
    description: gallery.description,
    url: `${SITE_URL}/galleries/${category?.slug}/${gallery.slug}`,
    datePublished: gallery.date,
    dateCreated: gallery.date,
    author: {
      '@type': 'Person',
      name: PHOTOGRAPHER_NAME,
      url: `${SITE_URL}/about`,
    },
    creator: {
      '@type': 'Person',
      name: PHOTOGRAPHER_NAME,
    },
    about: category
      ? {
          '@type': 'Thing',
          name: category.name,
          url: `${SITE_URL}/galleries/${category.slug}`,
        }
      : undefined,
    image: images
      ? images.map((img) => ({
          '@type': 'ImageObject',
          contentUrl: getLightboxImageUrl(img.url) || img.url, // High-res xlarge variant
          thumbnailUrl: getThumbnailUrl(img.url) || img.url, // Thumbnail variant
          name: img.alt_text,
          encodingFormat: 'image/webp',
        }))
      : undefined,
    associatedMedia: gallery.cover_image_id
      ? {
          '@type': 'ImageObject',
          contentUrl: gallery.cover_image_id,
        }
      : undefined,
    contentLocation: gallery.location
      ? {
          '@type': 'Place',
          name: gallery.location,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'MT',
            addressCountry: 'US',
          },
        }
      : undefined,
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * BreadcrumbList Schema
 * Represents navigation breadcrumbs
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return schema;
}

/**
 * CollectionPage Schema
 * Represents a category page with multiple galleries
 */
interface CollectionPageSchemaOptions {
  category: Category;
  galleries?: GalleryPublic[];
}

export function generateCollectionPageSchema(
  options: CollectionPageSchemaOptions
): object {
  const { category, galleries } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/galleries/${category.slug}`,
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/galleries/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    hasPart: galleries
      ? galleries.map((gallery) => ({
          '@type': 'ImageGallery',
          name: gallery.title,
          url: `${SITE_URL}/galleries/${category.slug}/${gallery.slug}`,
          image: gallery.cover_image_id,
        }))
      : undefined,
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * WebSite Schema
 * Represents the entire website with search functionality
 */
export function generateWebSiteSchema(): object {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: BUSINESS_NAME,
    description: 'Professional portrait photography in Montana',
    url: SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return schema;
}

/**
 * Helper function to render structured data as a script tag
 */
export function renderStructuredData(schema: object | object[]): string {
  const data = Array.isArray(schema) ? schema : [schema];
  return JSON.stringify(data.length === 1 ? data[0] : data);
}

