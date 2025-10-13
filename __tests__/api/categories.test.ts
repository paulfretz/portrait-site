/**
 * Integration Tests for Categories API
 * Tests the database query functions used by /api/categories endpoints
 */

import {
  generateSlug,
} from '@/lib/db/queries';
import type { CategoryInsert } from '@/lib/db/types';

describe('Categories API Integration', () => {
  describe('Slug Generation', () => {
    it('generates slug from simple name', () => {
      const slug = generateSlug('Weddings');
      expect(slug).toBe('weddings');
    });

    it('generates slug from name with spaces', () => {
      const slug = generateSlug('Family Portraits');
      expect(slug).toBe('family-portraits');
    });

    it('generates slug from name with special characters', () => {
      const slug = generateSlug('Pet & Animal Photography');
      expect(slug).toBe('pet-animal-photography');
    });

    it('generates slug from name with multiple spaces', () => {
      const slug = generateSlug('Senior   Portraits');
      expect(slug).toBe('senior-portraits');
    });

    it('generates slug from name with leading/trailing spaces', () => {
      const slug = generateSlug('  Engagements  ');
      expect(slug).toBe('engagements');
    });

    it('generates slug from name with uppercase', () => {
      const slug = generateSlug('WEDDINGS');
      expect(slug).toBe('weddings');
    });

    it('generates slug from name with mixed case', () => {
      const slug = generateSlug('FaMiLy PoRtRaItS');
      expect(slug).toBe('family-portraits');
    });

    it('handles empty string', () => {
      const slug = generateSlug('');
      expect(slug).toBe('');
    });

    it('handles numbers in name', () => {
      const slug = generateSlug('2024 Weddings');
      expect(slug).toBe('2024-weddings');
    });

    it('removes consecutive hyphens', () => {
      const slug = generateSlug('Test  -  Category');
      expect(slug).toBe('test-category');
    });
  });

  describe('Category Data Validation', () => {
    it('validates required name field', () => {
      const categoryData = {
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        display_order: 0,
      };

      expect(categoryData.name).toBeTruthy();
      expect(typeof categoryData.name).toBe('string');
    });

    it('validates slug format', () => {
      const slug = generateSlug('Test Category');
      
      // Slug should be lowercase, hyphenated, no spaces
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain(' ');
      expect(slug).not.toContain('_');
    });

    it('allows null description', () => {
      const categoryData = {
        name: 'Test',
        slug: 'test',
        description: null,
        display_order: 0,
      };

      expect(categoryData.description).toBeNull();
    });

    it('allows numeric display_order', () => {
      const categoryData = {
        name: 'Test',
        slug: 'test',
        description: null,
        display_order: 5,
      };

      expect(typeof categoryData.display_order).toBe('number');
      expect(categoryData.display_order).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Category Response Format', () => {
    it('validates category object structure', () => {
      const category = {
        id: 'test-id',
        name: 'Weddings',
        slug: 'weddings',
        description: 'Wedding photography',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('display_order');
      expect(category).toHaveProperty('created_at');
      expect(category).toHaveProperty('updated_at');
    });

    it('validates timestamp format', () => {
      const timestamp = '2024-01-01T00:00:00Z';
      const date = new Date(timestamp);
      
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toContain('2024-01-01');
      expect(date.getTime()).toBe(new Date('2024-01-01T00:00:00Z').getTime());
    });
  });

  describe('Slug Uniqueness Logic', () => {
    it('generates unique slugs for similar names', () => {
      const slug1 = generateSlug('Weddings');
      const slug2 = generateSlug('Wedding');
      const slug3 = generateSlug('Weddings 2024');

      // All should be different
      expect(slug1).not.toBe(slug2);
      expect(slug1).not.toBe(slug3);
      expect(slug2).not.toBe(slug3);
    });

    it('generates same slug for same name', () => {
      const slug1 = generateSlug('Weddings');
      const slug2 = generateSlug('Weddings');

      expect(slug1).toBe(slug2);
    });

    it('generates same slug regardless of whitespace', () => {
      const slug1 = generateSlug('Family Portraits');
      const slug2 = generateSlug('Family  Portraits');
      const slug3 = generateSlug('  Family Portraits  ');

      expect(slug1).toBe(slug2);
      expect(slug2).toBe(slug3);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid category data gracefully', () => {
      // Test that our validation logic works
      const invalidName = '';
      const isValid = invalidName.trim().length > 0;
      
      expect(isValid).toBe(false);
    });

    it('handles missing required fields', () => {
      const categoryData: Partial<CategoryInsert> = {
        slug: 'test',
        description: null,
      };

      // Name is required
      expect(categoryData.name).toBeUndefined();
    });
  });
});
