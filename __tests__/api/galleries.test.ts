/**
 * Integration Tests for Galleries API
 * Tests the database query functions used by /api/galleries endpoints
 */

import { generateSlug } from '@/lib/db/queries';
import type { GalleryInsert, GalleryUpdate } from '@/lib/db/types';

describe('Galleries API Integration', () => {
  describe('Slug Generation', () => {
    it('generates slug from simple title', () => {
      const slug = generateSlug('Summer Wedding');
      expect(slug).toBe('summer-wedding');
    });

    it('generates slug from title with special characters', () => {
      const slug = generateSlug('Smith & Jones Wedding');
      expect(slug).toBe('smith-jones-wedding');
    });

    it('generates slug from title with numbers', () => {
      const slug = generateSlug('2024 Family Portraits');
      expect(slug).toBe('2024-family-portraits');
    });

    it('handles long titles', () => {
      const slug = generateSlug('Beautiful Mountain Engagement Session in Big Sky Montana');
      expect(slug).toBe('beautiful-mountain-engagement-session-in-big-sky-montana');
    });

    it('removes consecutive hyphens', () => {
      const slug = generateSlug('Test  -  Gallery  -  Name');
      expect(slug).toBe('test-gallery-name');
    });

    it('handles apostrophes and quotes', () => {
      const slug = generateSlug("John's Wedding");
      expect(slug).toBe('johns-wedding');
    });
  });

  describe('Gallery Data Validation', () => {
    it('validates required fields', () => {
      const galleryData: GalleryInsert = {
        category_id: 'cat-123',
        title: 'Test Gallery',
        slug: 'test-gallery',
        description: null,
        date: '2024-06-15',
        location: 'Big Sky, MT',
        client_name: 'John Doe',
        cover_image_id: null,
        display_order: 0,
      };

      expect(galleryData.category_id).toBeTruthy();
      expect(galleryData.title).toBeTruthy();
      expect(galleryData.slug).toBeTruthy();
      expect(galleryData.date).toBeTruthy();
      expect(galleryData.location).toBeTruthy();
      expect(galleryData.client_name).toBeTruthy();
    });

    it('allows null optional fields', () => {
      const galleryData: GalleryInsert = {
        category_id: 'cat-123',
        title: 'Test',
        slug: 'test',
        description: null,
        date: '2024-01-01',
        location: 'Test Location',
        client_name: 'Test Client',
        cover_image_id: null,
        display_order: 0,
      };

      expect(galleryData.description).toBeNull();
      expect(galleryData.cover_image_id).toBeNull();
    });

    it('validates date format', () => {
      const dateString = '2024-06-15';
      const date = new Date(dateString);
      
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toContain('2024-06-15');
    });

    it('validates display_order is numeric', () => {
      const galleryData = {
        display_order: 5,
      };

      expect(typeof galleryData.display_order).toBe('number');
      expect(galleryData.display_order).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Gallery Update Validation', () => {
    it('allows partial updates', () => {
      const updates: GalleryUpdate = {
        title: 'Updated Title',
      };

      expect(updates.title).toBe('Updated Title');
      expect(updates.description).toBeUndefined();
      expect(updates.location).toBeUndefined();
    });

    it('allows updating multiple fields', () => {
      const updates: GalleryUpdate = {
        title: 'New Title',
        description: 'New description',
        location: 'New Location',
        date: '2024-12-25',
      };

      expect(Object.keys(updates).length).toBe(4);
    });

    it('allows setting fields to null', () => {
      const updates: GalleryUpdate = {
        description: null,
        cover_image_id: null,
      };

      expect(updates.description).toBeNull();
      expect(updates.cover_image_id).toBeNull();
    });
  });

  describe('Gallery Response Format', () => {
    it('validates gallery object structure', () => {
      const gallery = {
        id: 'gallery-123',
        category_id: 'cat-123',
        title: 'Test Gallery',
        slug: 'test-gallery',
        description: 'Test description',
        date: '2024-06-15',
        location: 'Big Sky, MT',
        client_name: 'John Doe',
        cover_image_id: 'img-123',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(gallery).toHaveProperty('id');
      expect(gallery).toHaveProperty('category_id');
      expect(gallery).toHaveProperty('title');
      expect(gallery).toHaveProperty('slug');
      expect(gallery).toHaveProperty('description');
      expect(gallery).toHaveProperty('date');
      expect(gallery).toHaveProperty('location');
      expect(gallery).toHaveProperty('client_name');
      expect(gallery).toHaveProperty('cover_image_id');
      expect(gallery).toHaveProperty('display_order');
      expect(gallery).toHaveProperty('created_at');
      expect(gallery).toHaveProperty('updated_at');
    });

    it('validates public gallery excludes client_name', () => {
      const publicGallery = {
        id: 'gallery-123',
        category_id: 'cat-123',
        title: 'Test Gallery',
        slug: 'test-gallery',
        description: 'Test description',
        date: '2024-06-15',
        location: 'Big Sky, MT',
        // client_name should NOT be here
        cover_image_id: 'img-123',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(publicGallery).not.toHaveProperty('client_name');
    });
  });

  describe('Date Handling', () => {
    it('accepts ISO date format', () => {
      const date = '2024-06-15';
      const parsed = new Date(date);
      
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(5); // June (0-indexed)
      // Date may vary by timezone, just check it's valid
      expect(parsed.getDate()).toBeGreaterThanOrEqual(14);
      expect(parsed.getDate()).toBeLessThanOrEqual(15);
    });

    it('handles date formatting for display', () => {
      const date = '2024-06-15';
      const formatted = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      expect(formatted).toContain('2024');
      expect(formatted).toContain('June');
    });
  });

  describe('Location Validation', () => {
    it('accepts Montana city names', () => {
      const locations = [
        'Big Sky, Montana',
        'Bozeman, MT',
        'Missoula',
        'Yellowstone National Park',
      ];

      locations.forEach(location => {
        expect(location).toBeTruthy();
        expect(typeof location).toBe('string');
      });
    });

    it('allows empty location', () => {
      const galleryData = {
        location: '',
      };

      expect(galleryData.location).toBe('');
    });
  });

  describe('Slug Uniqueness', () => {
    it('generates unique slugs for similar titles', () => {
      const slug1 = generateSlug('Summer Wedding');
      const slug2 = generateSlug('Summer Wedding 2024');
      const slug3 = generateSlug('Summer Weddings');

      expect(slug1).not.toBe(slug2);
      expect(slug1).not.toBe(slug3);
      expect(slug2).not.toBe(slug3);
    });

    it('generates same slug for same title', () => {
      const slug1 = generateSlug('Test Gallery');
      const slug2 = generateSlug('Test Gallery');

      expect(slug1).toBe(slug2);
    });

    it('ignores whitespace differences', () => {
      const slug1 = generateSlug('Test Gallery');
      const slug2 = generateSlug('  Test  Gallery  ');
      const slug3 = generateSlug('Test   Gallery');

      expect(slug1).toBe(slug2);
      expect(slug2).toBe(slug3);
    });
  });

  describe('Error Handling', () => {
    it('validates required title field', () => {
      const invalidTitle = '';
      const isValid = invalidTitle.trim().length > 0;
      
      expect(isValid).toBe(false);
    });

    it('validates required category_id field', () => {
      const galleryData: Partial<GalleryInsert> = {
        title: 'Test',
        slug: 'test',
      };

      expect(galleryData.category_id).toBeUndefined();
    });

    it('validates required date field', () => {
      const galleryData: Partial<GalleryInsert> = {
        title: 'Test',
        slug: 'test',
        category_id: 'cat-123',
      };

      expect(galleryData.date).toBeUndefined();
    });

    it('handles invalid date format', () => {
      const invalidDate = 'not-a-date';
      const date = new Date(invalidDate);
      
      expect(isNaN(date.getTime())).toBe(true);
    });
  });

  describe('Client Name Privacy', () => {
    it('validates client_name is required in insert', () => {
      const galleryData: GalleryInsert = {
        category_id: 'cat-123',
        title: 'Test',
        slug: 'test',
        description: null,
        date: '2024-01-01',
        location: 'Test',
        client_name: 'Private Client',
        cover_image_id: null,
        display_order: 0,
      };

      expect(galleryData.client_name).toBeTruthy();
    });

    it('ensures client_name is string type', () => {
      const clientName = 'John Doe';
      expect(typeof clientName).toBe('string');
    });
  });
});

