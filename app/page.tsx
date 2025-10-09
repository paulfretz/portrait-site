import { HeroSlideshow } from '@/components/home/HeroSlideshow';
import { HomeHeroContent } from '@/components/home/HomeHeroContent';
import { getPageContents } from '@/lib/db/queries';

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

  return (
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
  );
}
