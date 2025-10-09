'use client';

import { InlineEditor } from '@/components/admin/InlineEditor';
import { useState } from 'react';

interface HomeHeroContentProps {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export function HomeHeroContent({
  headline: initialHeadline,
  subheadline: initialSubheadline,
  ctaPrimary: initialCtaPrimary,
  ctaSecondary: initialCtaSecondary,
}: HomeHeroContentProps) {
  const [headline, setHeadline] = useState(initialHeadline);
  const [subheadline, setSubheadline] = useState(initialSubheadline);
  const [ctaPrimary, setCtaPrimary] = useState(initialCtaPrimary);
  const [ctaSecondary, setCtaSecondary] = useState(initialCtaSecondary);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <InlineEditor
            page="homepage"
            section="hero-headline"
            initialValue={headline}
            as="h2"
            className="text-3xl font-light text-neutral-900 mb-4"
            onSave={setHeadline}
          />
          <InlineEditor
            page="homepage"
            section="hero-subheadline"
            initialValue={subheadline}
            contentType="textarea"
            as="p"
            className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8"
            onSave={setSubheadline}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/galleries"
              className="px-6 py-3 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
            >
              <InlineEditor
                page="homepage"
                section="cta-primary"
                initialValue={ctaPrimary}
                as="span"
                className="inline-block"
                onSave={setCtaPrimary}
              />
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-sage-400 text-sage-600 rounded-md hover:bg-sage-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
            >
              <InlineEditor
                page="homepage"
                section="cta-secondary"
                initialValue={ctaSecondary}
                as="span"
                className="inline-block"
                onSave={setCtaSecondary}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

