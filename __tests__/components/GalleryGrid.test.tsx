import { render, screen } from '@testing-library/react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { mockGallery } from '../utils/test-utils';

// Create multiple mock galleries for testing
const mockGalleries = [
  {
    ...mockGallery,
    id: 'gallery-1',
    title: 'Summer Wedding',
    slug: 'summer-wedding',
    description: 'Beautiful summer wedding in the mountains',
    date: '2024-06-15',
    location: 'Big Sky, Montana',
  },
  {
    ...mockGallery,
    id: 'gallery-2',
    title: 'Mountain Engagement',
    slug: 'mountain-engagement',
    description: 'Beautiful mountain engagement session',
    date: '2024-05-20',
    location: 'Bozeman, Montana',
  },
  {
    ...mockGallery,
    id: 'gallery-3',
    title: 'Family Portraits',
    slug: 'family-portraits',
    description: 'Heartwarming family portrait session',
    date: '2024-07-10',
    location: 'Missoula, Montana',
  },
];

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock OptimizedImage component
jest.mock('@/components/gallery/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  ),
}));

describe('GalleryGrid', () => {
  describe('Empty State', () => {
    it('renders empty state when no galleries provided', () => {
      render(<GalleryGrid galleries={[]} />);
      
      expect(screen.getByText('No Galleries Found')).toBeInTheDocument();
      expect(screen.getByText('There are no galleries available at this time.')).toBeInTheDocument();
    });

    it('renders empty state icon', () => {
      const { container } = render(<GalleryGrid galleries={[]} />);
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-sage-600');
    });
  });

  describe('Gallery Display', () => {
    const galleriesWithImages = mockGalleries.map((gallery) => ({
      ...gallery,
      category_slug: 'weddings',
      cover_image_url: 'https://example.com/image.jpg',
    }));

    it('renders all galleries in a grid', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        expect(screen.getByText(gallery.title)).toBeInTheDocument();
      });
    });

    it('renders gallery cover images', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const images = screen.getAllByTestId('optimized-image');
      expect(images).toHaveLength(galleriesWithImages.length);
      
      images.forEach((img, index) => {
        expect(img).toHaveAttribute('src', galleriesWithImages[index].cover_image_url);
        expect(img).toHaveAttribute('alt', galleriesWithImages[index].title);
      });
    });

    it('renders gallery titles', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        const title = screen.getByText(gallery.title);
        expect(title).toBeInTheDocument();
        expect(title.tagName).toBe('H3');
      });
    });

    it('renders gallery descriptions when present', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        if (gallery.description) {
          expect(screen.getByText(gallery.description)).toBeInTheDocument();
        }
      });
    });

    it('renders gallery dates in correct format', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        if (gallery.date) {
          const formattedDate = new Date(gallery.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          expect(screen.getByText(formattedDate)).toBeInTheDocument();
        }
      });
    });

    it('renders gallery locations when present', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        if (gallery.location) {
          expect(screen.getByText(gallery.location)).toBeInTheDocument();
        }
      });
    });

    it('creates correct links to gallery pages', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      galleriesWithImages.forEach((gallery) => {
        const link = screen.getByText(gallery.title).closest('a');
        expect(link).toHaveAttribute(
          'href',
          `/galleries/${gallery.category_slug}/${gallery.slug}`
        );
      });
    });
  });

  describe('Gallery Without Cover Image', () => {
    const galleriesWithoutImages = mockGalleries.map((gallery) => ({
      ...gallery,
      category_slug: 'portraits',
      cover_image_url: null,
    }));

    it('renders placeholder icon when no cover image', () => {
      const { container } = render(<GalleryGrid galleries={galleriesWithoutImages} />);
      
      // Should render placeholder SVG icons instead of OptimizedImage
      const placeholderIcons = container.querySelectorAll('.bg-gradient-to-br svg');
      expect(placeholderIcons.length).toBeGreaterThan(0);
    });

    it('does not render OptimizedImage when cover_image_url is null', () => {
      render(<GalleryGrid galleries={galleriesWithoutImages} />);
      
      const images = screen.queryAllByTestId('optimized-image');
      expect(images).toHaveLength(0);
    });
  });

  describe('Responsive Grid Layout', () => {
    const galleriesWithImages = mockGalleries.map((gallery) => ({
      ...gallery,
      category_slug: 'weddings',
      cover_image_url: 'https://example.com/image.jpg',
    }));

    it('applies responsive grid classes', () => {
      const { container } = render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('applies hover effects to gallery cards', () => {
      const { container } = render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const cards = container.querySelectorAll('.group');
      cards.forEach((card) => {
        expect(card).toHaveClass('hover:shadow-md');
        expect(card).toHaveClass('transition-all');
      });
    });
  });

  describe('Accessibility', () => {
    const galleriesWithImages = mockGalleries.map((gallery) => ({
      ...gallery,
      category_slug: 'weddings',
      cover_image_url: 'https://example.com/image.jpg',
    }));

    it('renders semantic HTML with proper heading hierarchy', () => {
      const { container } = render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBe(galleriesWithImages.length);
    });

    it('provides alt text for all images', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const images = screen.getAllByTestId('optimized-image');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('renders clickable links with proper href attributes', () => {
      render(<GalleryGrid galleries={galleriesWithImages} />);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(galleriesWithImages.length);
      
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toMatch(/^\/galleries\//);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles galleries with missing optional fields', () => {
      const minimalGalleries = [
        {
          id: '1',
          category_id: 'cat-1',
          category_slug: 'test',
          title: 'Minimal Gallery',
          slug: 'minimal-gallery',
          description: null,
          date: '2024-01-01',
          location: '',
          cover_image_id: null,
          cover_image_url: null,
          display_order: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      render(<GalleryGrid galleries={minimalGalleries} />);
      
      expect(screen.getByText('Minimal Gallery')).toBeInTheDocument();
      // Should not crash when optional fields are missing
    });

    it('handles undefined galleries array', () => {
      // @ts-expect-error Testing runtime behavior
      render(<GalleryGrid galleries={undefined} />);
      
      expect(screen.getByText('No Galleries Found')).toBeInTheDocument();
    });

    it('handles single gallery', () => {
      const singleGallery = [{
        ...mockGalleries[0],
        category_slug: 'weddings',
        cover_image_url: 'https://example.com/image.jpg',
      }];

      render(<GalleryGrid galleries={singleGallery} />);
      
      expect(screen.getByText(singleGallery[0].title)).toBeInTheDocument();
    });

    it('handles many galleries (performance)', () => {
      const manyGalleries = Array.from({ length: 50 }, (_, i) => ({
        ...mockGalleries[0],
        id: `gallery-${i}`,
        title: `Gallery ${i}`,
        slug: `gallery-${i}`,
        category_slug: 'weddings',
        cover_image_url: 'https://example.com/image.jpg',
      }));

      const { container } = render(<GalleryGrid galleries={manyGalleries} />);
      
      const cards = container.querySelectorAll('.group');
      expect(cards).toHaveLength(50);
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      const galleriesWithDates = [{
        ...mockGalleries[0],
        category_slug: 'weddings',
        cover_image_url: 'https://example.com/image.jpg',
        date: '2024-06-15',
      }];

      render(<GalleryGrid galleries={galleriesWithDates} />);
      
      // Check that a date is rendered (timezone may affect exact date)
      const expectedDate = new Date('2024-06-15').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it('handles invalid date gracefully', () => {
      const galleriesWithInvalidDate = [{
        ...mockGalleries[0],
        category_slug: 'weddings',
        cover_image_url: 'https://example.com/image.jpg',
        date: 'invalid-date',
      }];

      // Should not crash
      expect(() => {
        render(<GalleryGrid galleries={galleriesWithInvalidDate} />);
      }).not.toThrow();
    });
  });
});

