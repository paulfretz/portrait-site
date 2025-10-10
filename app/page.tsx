import { Metadata } from 'next';
import { HeroSlideshow } from '@/components/home/HeroSlideshow';
import { HomeHeroContent } from '@/components/home/HomeHeroContent';
import { getPageContents } from '@/lib/db/queries';
import { generatePageTitle, generateMetaDescription, generateOpenGraphTags, generateTwitterCardTags, generateCanonicalUrl } from '@/lib/utils/seo';
import { generateOrganizationSchema, generateWebSiteSchema, renderStructuredData } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: generatePageTitle(''),
  description: generateMetaDescription(
    'Professional portrait photographer capturing authentic moments and timeless memories in Montana',
    { includeLocation: true, includeService: 'wedding photographer' }
  ),
  alternates: {
    canonical: generateCanonicalUrl('/'),
  },
  openGraph: generateOpenGraphTags({
    title: 'DJ Coveno Portraits - Montana Portrait Photography',
    description:
      'Professional portrait photographer serving Big Sky, Bozeman, and Yellowstone. Specializing in weddings, engagements, families, and authentic storytelling.',
    type: 'website',
  }),
  twitter: generateTwitterCardTags({
    title: 'DJ Coveno Portraits - Montana Portrait Photography',
    description:
      'Professional portrait photographer serving Big Sky, Bozeman, and Yellowstone. Specializing in weddings, engagements, families, and authentic storytelling.',
  }),
};

/**
 * Homepage Component
 * Main landing page with full-screen slideshow hero
 *
 * Features:
 * - Full-screen slideshow showcasing portfolio images
 * - Automatic transitions between images
 * - Manual navigation controls
 * - Inline editing for headline, subheadline, and CTA text (when admin logged in)
 * - Responsive design
 *
 * @component
 */
export default async function Home() {
  // Fetch homepage content from database
  const content = await getPageContents('homepage');
  
  const headline = content.find((c) => c.section === 'hero-headline')?.content || "Capturing Life's Beautiful Moments";
  const subheadline = content.find((c) => c.section === 'hero-subheadline')?.content || "Professional portrait photography in Montana. Specializing in weddings, engagements, families, and personal portraits throughout the Big Sky State.";
  const ctaPrimary = content.find((c) => c.section === 'cta-primary')?.content || 'View Galleries';
  const ctaSecondary = content.find((c) => c.section === 'cta-secondary')?.content || 'Get In Touch';

  // Generate structured data for homepage
  const organizationSchema = generateOrganizationSchema({
    sameAs: [
      // Add social media profiles here when available
      // 'https://www.instagram.com/djcoveno',
      // 'https://www.facebook.com/djcoveno',
    ],
  });

  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderStructuredData([organizationSchema, websiteSchema]),
        }}
      />

      <div className="relative">
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Content below slideshow */}
        <HomeHeroContent
          headline={headline}
          subheadline={subheadline}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
        />
      </div>
    </>
  );
}
