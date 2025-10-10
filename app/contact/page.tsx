import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactContent } from '@/components/contact/ContactContent';
import { getPageContents } from '@/lib/db/queries';
import { generatePageTitle, generateMetaDescription, generateOpenGraphTags, generateCanonicalUrl } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: generatePageTitle('Contact'),
  description: generateMetaDescription(
    'Book your Montana wedding photographer or portrait session. Professional photography for weddings, engagement photos, family portraits, senior photos, and more',
    { includeLocation: true }
  ),
  alternates: {
    canonical: generateCanonicalUrl('/contact'),
  },
  openGraph: generateOpenGraphTags({
    title: 'Contact DJ Coveno | Montana Wedding & Portrait Photographer',
    description:
      'Book your Montana wedding photographer or portrait session. Professional photography for weddings, engagement photos, family portraits, senior photos, and special moments.',
    type: 'website',
  }),
};

export default async function ContactPage() {
  // Fetch contact page content from database
  const content = await getPageContents('contact');

  const heroHeadline =
    content.find((c) => c.section === 'hero-headline')?.content || "Let's Connect";
  const heroDescription =
    content.find((c) => c.section === 'hero-description')?.content ||
    "I'd love to hear about your vision and discuss how we can capture your special moments together.";
  const getInTouchDescription =
    content.find((c) => c.section === 'get-in-touch-description')?.content ||
    "Whether you're planning a wedding in Big Sky, an engagement session in Bozeman, or a family portrait near Yellowstone, I'm here to help bring your vision to life. Fill out the form and I'll get back to you within 24 hours.";
  const email =
    content.find((c) => c.section === 'email')?.content || 'hello@djcovenoportraits.com';
  const phone = content.find((c) => c.section === 'phone')?.content || '(406) 555-1234';
  const serviceArea =
    content.find((c) => c.section === 'service-area')?.content ||
    'Big Sky, Bozeman, Yellowstone\nand surrounding Montana areas';
  const instagramUrl =
    content.find((c) => c.section === 'instagram-url')?.content ||
    'https://instagram.com/djcovenoportraits';
  const facebookUrl =
    content.find((c) => c.section === 'facebook-url')?.content ||
    'https://facebook.com/djcovenoportraits';
  const pinterestUrl =
    content.find((c) => c.section === 'pinterest-url')?.content ||
    'https://pinterest.com/djcovenoportraits';

  return (
    <div className="min-h-screen bg-white">
      {/* Editable Contact Content */}
      <ContactContent
        heroHeadline={heroHeadline}
        heroDescription={heroDescription}
        getInTouchDescription={getInTouchDescription}
        email={email}
        phone={phone}
        serviceArea={serviceArea}
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
        pinterestUrl={pinterestUrl}
      >
        <ContactForm />
      </ContactContent>

      {/* FAQ or Additional Info */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-gray-900 mb-6">What to Expect</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-serif text-sage-600">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inquiry</h3>
                <p className="text-gray-600 text-sm">
                  Fill out the form with details about your session
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-serif text-sage-600">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation</h3>
                <p className="text-gray-600 text-sm">
                  We'll discuss your vision, location, and timeline
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-serif text-sage-600">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Book</h3>
                <p className="text-gray-600 text-sm">
                  Secure your date and start planning your session
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

