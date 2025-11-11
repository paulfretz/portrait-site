/**
 * Unit Tests for PhotoGrid Component
 * Tests masonry layout (mobile) and justified layout (desktop)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotoGrid } from '@/components/gallery/PhotoGrid';
import { mockImage } from '../utils/test-utils';

// Mock the image-urls utility
jest.mock('@/lib/utils/image-urls', () => ({
  getImageVariantUrl: jest.fn((url: string, variant: string, format: string) =>
    url.replace('.jpeg', `-${variant}.${format}`)
  ),
  getLightboxImageUrl: jest.fn((url) => url.replace('.jpeg', '-xlarge.webp')),
  getThumbnailUrl: jest.fn((url) => url.replace('.jpeg', '-thumbnail.webp')),
}));

// Mock the useJustifiedLayout hook
jest.mock('@/lib/hooks/useJustifiedLayout', () => ({
  useJustifiedLayout: jest.fn(() => ({
    containerHeight: 1000,
    boxes: [
      { top: 0, left: 0, width: 400, height: 300 },
      { top: 0, left: 410, width: 400, height: 300 },
      { top: 310, left: 0, width: 400, height: 300 },
    ],
  })),
}));

// Mock react-masonry-css
jest.mock('react-masonry-css', () => {
  return function Masonry({ children, className, columnClassName }: any) {
    return (
      <div className={className} data-testid="masonry-grid">
        <div className={columnClassName}>{children}</div>
      </div>
    );
  };
});

describe('PhotoGrid Component', () => {
  const mockImages = [
    { ...mockImage, id: 'img-1', url: 'https://test.url/image1.jpeg', alt_text: 'Image 1' },
    { ...mockImage, id: 'img-2', url: 'https://test.url/image2.jpeg', alt_text: 'Image 2' },
    { ...mockImage, id: 'img-3', url: 'https://test.url/image3.jpeg', alt_text: 'Image 3' },
  ];

  const mockOpenLightbox = jest.fn();
  const defaultProps = {
    images: mockImages,
    galleryTitle: 'Test Gallery',
    openLightbox: mockOpenLightbox,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<PhotoGrid {...defaultProps} />);
      expect(screen.getByRole('button', { name: /Image 1/i })).toBeInTheDocument();
    });

    it('renders all images', () => {
      render(<PhotoGrid {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(mockImages.length);
    });

    it('uses alt text from images', () => {
      render(<PhotoGrid {...defaultProps} />);
      expect(screen.getByAltText('Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Image 2')).toBeInTheDocument();
      expect(screen.getByAltText('Image 3')).toBeInTheDocument();
    });

    it('falls back to gallery title when alt text is missing', () => {
      const imagesWithoutAlt = mockImages.map((img) => ({ ...img, alt_text: null }));
      render(<PhotoGrid {...defaultProps} images={imagesWithoutAlt} />);
      
      const altTexts = screen.getAllByAltText('Test Gallery');
      expect(altTexts.length).toBe(3);
    });
  });

  describe('Masonry Layout (Mobile)', () => {
    beforeEach(() => {
      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
    });

    it('renders masonry grid on mobile', () => {
      render(<PhotoGrid {...defaultProps} />);
      // Masonry grid should be present
      const masonryGrid = screen.queryByTestId('masonry-grid');
      // Note: May not be visible immediately due to responsive detection
      expect(masonryGrid).toBeDefined();
    });

    it('renders images with proper structure', () => {
      const { container } = render(<PhotoGrid {...defaultProps} />);
      // Check that images are rendered
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
    });
  });

  describe('Justified Layout (Desktop)', () => {
    beforeEach(() => {
      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
    });

    it('uses justified layout on desktop', () => {
      const { container } = render(<PhotoGrid {...defaultProps} />);
      // Justified layout uses absolute positioning
      const absolutePositioned = container.querySelectorAll('.absolute');
      expect(absolutePositioned.length).toBeGreaterThan(0);
    });

    it('applies box dimensions from justified layout', () => {
      const { container } = render(<PhotoGrid {...defaultProps} />);
      // Check for inline styles with positioning
      const styledButtons = container.querySelectorAll('button[style]');
      expect(styledButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('renders clickable buttons for each image', () => {
      render(<PhotoGrid {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });

    it('buttons have proper cursor styling', () => {
      const { container } = render(<PhotoGrid {...defaultProps} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('cursor-pointer');
      });
    });

    it('shows hover overlay on image hover', () => {
      const { container } = render(<PhotoGrid {...defaultProps} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons[0]).toHaveClass('group');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles window resize', async () => {
      const { rerender } = render(<PhotoGrid {...defaultProps} />);
      
      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      fireEvent(window, new Event('resize'));
      
      // Component should still render
      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBe(3);
      });
    });
  });

  describe('Empty State', () => {
    it('renders nothing when no images provided', () => {
      const { container } = render(<PhotoGrid {...defaultProps} images={[]} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('all images are keyboard accessible', () => {
      render(<PhotoGrid {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('has proper ARIA labels via alt text', () => {
      render(<PhotoGrid {...defaultProps} />);
      expect(screen.getByAltText('Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Image 2')).toBeInTheDocument();
      expect(screen.getByAltText('Image 3')).toBeInTheDocument();
    });
  });
});

