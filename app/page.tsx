import { HeroSlideshow } from '@/components/home/HeroSlideshow';

/**
 * Homepage Component
 * Main landing page with full-screen slideshow hero
 *
 * Features:
 * - Full-screen slideshow showcasing portfolio images
 * - Automatic transitions between images
 * - Manual navigation controls
 * - Responsive design
 *
 * @component
 */
export default function Home() {
  return (
    <div className="relative">
      {/* Hero Slideshow */}
      <HeroSlideshow />
      
      {/* Content below slideshow */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-light text-neutral-900 mb-4">
              Capturing Life's Beautiful Moments
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
              Professional portrait photography in Montana. Specializing in weddings, 
              engagements, families, and personal portraits throughout the Big Sky State.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/galleries"
                className="px-6 py-3 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
              >
                View Galleries
              </a>
              <a
                href="/contact"
                className="px-6 py-3 border border-sage-400 text-sage-600 rounded-md hover:bg-sage-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
