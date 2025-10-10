import { Metadata } from 'next';
import { AboutContent } from '@/components/about/AboutContent';
import { getPageContents } from '@/lib/db/queries';
import { generatePageTitle, generateMetaDescription, generateOpenGraphTags, generateCanonicalUrl } from '@/lib/utils/seo';
import { generatePersonSchema, renderStructuredData } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: generatePageTitle('About'),
  description: generateMetaDescription(
    'Meet DJ Coveno, Montana wedding photographer and portrait specialist. Capturing weddings, engagements, families, seniors, and pets',
    { includeLocation: true }
  ),
  alternates: {
    canonical: generateCanonicalUrl('/about'),
  },
  openGraph: generateOpenGraphTags({
    title: 'About DJ Coveno | Montana Wedding & Portrait Photographer',
    description:
      'Professional wedding photographer and portrait specialist serving Montana. Specializing in weddings, engagement photos, family portraits, and authentic storytelling.',
    type: 'website',
  }),
};

export default async function AboutPage() {
  // Fetch about page content from database
  const content = await getPageContents('about');

  const bioTitle = content.find((c) => c.section === 'bio-title')?.content || "Hello, I'm DJ";
  const bioContent =
    content.find((c) => c.section === 'bio-content')?.content ||
    `<p class="text-lg text-gray-600 leading-relaxed mb-4">I'm a portrait photographer based in the heart of Montana, where the stunning landscapes provide the perfect backdrop for capturing life's most precious moments.</p><p class="text-lg text-gray-600 leading-relaxed">From intimate engagements in Big Sky to joyful family sessions in Bozeman, I specialize in creating authentic, timeless images that tell your unique story.</p>`;

  const experienceContent =
    content.find((c) => c.section === 'experience-content')?.content ||
    `<p class="text-gray-600 leading-relaxed mb-6">With years of experience photographing weddings, engagements, families, and portraits across Montana, I've had the privilege of working with hundreds of clients and capturing thousands of unforgettable moments.</p><p class="text-gray-600 leading-relaxed mb-6">My journey into photography began with a deep appreciation for Montana's natural beauty and a desire to preserve the fleeting moments that make life special. Whether it's the nervous excitement of a proposal, the joy of a wedding day, or the warmth of a family gathering, I'm passionate about documenting these stories with authenticity and artistry.</p><p class="text-gray-600 leading-relaxed">I've been fortunate to work in some of Montana's most beautiful locations, including Big Sky, Bozeman, Yellowstone National Park, and the surrounding areas. Each location offers its own unique character and charm, providing endless possibilities for creating stunning, meaningful photographs.</p>`;

  const approachContent =
    content.find((c) => c.section === 'approach-content')?.content ||
    `<p class="text-gray-600 leading-relaxed mb-6">My photography style is rooted in authenticity and natural beauty. I believe the best photographs happen when people feel comfortable and relaxed, so I work to create an environment where you can simply be yourself.</p><p class="text-gray-600 leading-relaxed mb-6">Rather than directing every moment, I prefer to guide you into natural interactions and then step back to capture the genuine connections and emotions that unfold. This approach results in images that feel true to who you are and how you experience the world.</p><p class="text-gray-600 leading-relaxed">Whether we're working together on your wedding day, a family session, or an engagement shoot, my goal is always the same: to create beautiful, meaningful photographs that you'll treasure for generations to come.</p>`;

  const profilePhotoUrl = content.find((c) => c.section === 'profile-photo-url')?.content || null;

  // Generate Person schema for photographer
  const personSchema = generatePersonSchema({
    image: profilePhotoUrl || undefined,
    sameAs: [
      // Add social media profiles here when available
      // 'https://www.instagram.com/djcoveno',
      // 'https://www.facebook.com/djcoveno',
    ],
  });

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderStructuredData(personSchema),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sage-50 to-sage-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6">
                About DJ Coveno
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Montana portrait photographer capturing life's beautiful moments
              </p>
            </div>
          </div>
        </section>

        {/* Editable Content Sections */}
        <AboutContent
          bioTitle={bioTitle}
          bioContent={bioContent}
          experienceContent={experienceContent}
          approachContent={approachContent}
          profilePhotoUrl={profilePhotoUrl}
        />
      </div>
    </>
  );
}
