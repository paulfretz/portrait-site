import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PhotoGrid } from '@/components/gallery/PhotoGrid';
import { getGalleryBySlug, getCategoryBySlug, getImagesByGalleryId } from '@/lib/db/queries';

interface GalleryPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  
  try {
    const gallery = await getGalleryBySlug(category, slug);
    
    if (!gallery) {
      return {
        title: 'Gallery Not Found | Montana Portrait Photography',
        description: 'The requested gallery could not be found.',
      };
    }

    return {
      title: `${gallery.title} | Montana Portrait Photography`,
      description: gallery.description || `View ${gallery.title} portrait photography gallery by Montana Portrait Photography.`,
      openGraph: {
        title: `${gallery.title} | Montana Portrait Photography`,
        description: gallery.description || `View ${gallery.title} portrait photography gallery.`,
        type: 'website',
        images: gallery.cover_image_id ? [{ url: gallery.cover_image_id }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for gallery page:', error);
    return {
      title: 'Gallery | Montana Portrait Photography',
      description: 'View portrait photography gallery.',
    };
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { category, slug } = await params;
  
  try {
    // Fetch gallery data, category, and images in parallel
    const [gallery, categoryData, images] = await Promise.all([
      getGalleryBySlug(category, slug),
      getCategoryBySlug(category),
      getGalleryBySlug(category, slug).then(g => g ? getImagesByGalleryId(g.id) : []),
    ]);

    if (!gallery || !categoryData) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Navigation */}
        <nav className="bg-gradient-to-br from-sage-50 to-sage-100 py-4 border-b border-sage-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/galleries" className="hover:text-sage-700 transition-colors">
                Galleries
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/galleries/${category}`} className="hover:text-sage-700 transition-colors">
                {categoryData.name}
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{gallery.title}</span>
            </div>
          </div>
        </nav>

        {/* Gallery Header */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6">
                {gallery.title}
              </h1>
              
              {gallery.description && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                  {gallery.description}
                </p>
              )}

              {/* Gallery Metadata */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                {gallery.date && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Date(gallery.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                
                {gallery.location && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{gallery.location}</span>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Photo Grid */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <PhotoGrid images={images} galleryTitle={gallery.title} />
          </div>
        </section>

        {/* Back to Category Link */}
        <section className="pb-16">
          <div className="container mx-auto px-4 text-center">
            <Link
              href={`/galleries/${category}`}
              className="inline-flex items-center text-sage-700 hover:text-sage-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {categoryData.name}
            </Link>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading gallery page:', error);
    notFound();
  }
}

