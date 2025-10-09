import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | DJ Coveno Portraits',
  description:
    'Meet DJ Coveno, a Montana-based portrait photographer specializing in weddings, engagements, families, and more. Capturing authentic moments across Big Sky, Bozeman, and Yellowstone.',
  openGraph: {
    title: 'About DJ Coveno | Montana Portrait Photography',
    description:
      'Professional portrait photographer serving Montana. Specializing in weddings, engagements, families, and authentic storytelling.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
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

      {/* Profile Photo Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Profile Photo */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-sage-100 to-sage-200 shadow-lg">
                  {/* Placeholder - will be replaced with actual photo via inline editing */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-sage-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bio Summary */}
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                  Hello, I'm DJ
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  I'm a portrait photographer based in the heart of Montana, where the stunning
                  landscapes provide the perfect backdrop for capturing life's most precious
                  moments.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From intimate engagements in Big Sky to joyful family sessions in Bozeman, I
                  specialize in creating authentic, timeless images that tell your unique story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
              Experience & Background
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                With years of experience photographing weddings, engagements, families, and
                portraits across Montana, I've had the privilege of working with hundreds of
                clients and capturing thousands of unforgettable moments.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                My journey into photography began with a deep appreciation for Montana's natural
                beauty and a desire to preserve the fleeting moments that make life special.
                Whether it's the nervous excitement of a proposal, the joy of a wedding day, or
                the warmth of a family gathering, I'm passionate about documenting these stories
                with authenticity and artistry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I've been fortunate to work in some of Montana's most beautiful locations,
                including Big Sky, Bozeman, Yellowstone National Park, and the surrounding areas.
                Each location offers its own unique character and charm, providing endless
                possibilities for creating stunning, meaningful photographs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy/Approach Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
              My Approach to Photography
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Authentic */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Authentic</h3>
                <p className="text-gray-600">
                  I capture genuine emotions and real moments, not forced poses or artificial
                  smiles.
                </p>
              </div>

              {/* Natural */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Natural Light</h3>
                <p className="text-gray-600">
                  I work with natural light whenever possible, creating soft, timeless images.
                </p>
              </div>

              {/* Storytelling */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Storytelling</h3>
                <p className="text-gray-600">
                  Every session tells a story. I focus on the narrative, not just the individual
                  shots.
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                My photography style is rooted in authenticity and natural beauty. I believe the
                best photographs happen when people feel comfortable and relaxed, so I work to
                create an environment where you can simply be yourself.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Rather than directing every moment, I prefer to guide you into natural
                interactions and then step back to capture the genuine connections and emotions
                that unfold. This approach results in images that feel true to who you are and how
                you experience the world.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether we're working together on your wedding day, a family session, or an
                engagement shoot, my goal is always the same: to create beautiful, meaningful
                photographs that you'll treasure for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-sage-50 to-sage-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              I'd love to hear about your vision and discuss how we can work together to capture
              your special moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/galleries"
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                View My Work
              </a>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors font-medium"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

