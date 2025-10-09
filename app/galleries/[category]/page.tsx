import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getCategoryBySlug, getGalleriesByCategory } from '@/lib/db/queries';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  try {
    const categoryData = await getCategoryBySlug(category);
    
    if (!categoryData) {
      return {
        title: 'Category Not Found | Montana Portrait Photography',
        description: 'The requested category could not be found.',
      };
    }

    return {
      title: `${categoryData.name} | Montana Portrait Photography`,
      description: categoryData.description || `Explore ${categoryData.name} portrait photography galleries by Montana Portrait Photography.`,
      openGraph: {
        title: `${categoryData.name} | Montana Portrait Photography`,
        description: categoryData.description || `Explore ${categoryData.name} portrait photography galleries.`,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category page:', error);
    return {
      title: 'Category | Montana Portrait Photography',
      description: 'Explore portrait photography galleries.',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  try {
    // Fetch category data and galleries in parallel
    const [categoryData, galleries] = await Promise.all([
      getCategoryBySlug(category),
      getGalleriesByCategory(category),
    ]);

    if (!categoryData) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sage-50 to-sage-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6">
                {categoryData.name}
              </h1>
              {categoryData.description && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {categoryData.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Galleries Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                {galleries.length === 0 ? 'No Galleries Yet' : `${galleries.length} ${galleries.length === 1 ? 'Gallery' : 'Galleries'}`}
              </h2>
              {galleries.length > 0 && (
                <p className="text-lg text-gray-600">
                  Explore our collection of {categoryData.name.toLowerCase()} portrait sessions
                </p>
              )}
            </div>

            {galleries.length > 0 ? (
              <GalleryGrid galleries={galleries.map(gallery => ({ ...gallery, category_slug: category }))} />
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-sage-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're working on adding galleries to this category. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
