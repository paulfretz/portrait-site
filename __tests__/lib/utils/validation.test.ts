/**
 * Unit Tests for Validation Schemas
 * Tests the Zod validation schemas used in API routes
 */

import { z } from 'zod';

// Recreate the inquiry schema from app/api/inquiries/route.ts
const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  event_type: z.enum([
    'Wedding',
    'Engagement',
    'Portrait',
    'Pet',
    'Family',
    'Senior',
    'Proposal',
    'Other',
  ]),
  event_date: z.string().optional().nullable(),
  budget: z
    .enum(['<$1000', '$1000-$2500', '$2500-$5000', '$5000+', 'Not Sure'])
    .optional()
    .nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  honeypot: z.string().optional(),
});

describe('Validation Schemas', () => {
  describe('Inquiry Schema - Valid Data', () => {
    it('validates complete inquiry with all fields', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        event_date: '2024-06-15',
        budget: '$2500-$5000',
        message: 'Looking for wedding photographer in Montana',
        honeypot: '',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates inquiry with only required fields', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Looking for photographer',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates inquiry with null optional fields', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Portrait',
        event_date: null,
        budget: null,
        message: 'Interested in portrait session',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Inquiry Schema - Name Validation', () => {
    it('rejects name shorter than 2 characters', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 100 characters', () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts name at minimum length', () => {
      const validData = {
        name: 'Jo',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts name at maximum length', () => {
      const validData = {
        name: 'A'.repeat(100),
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Inquiry Schema - Email Validation', () => {
    it('rejects invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects email without @', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'johnexample.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects email without domain', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@example.com',
        'user_name@example-domain.com',
      ];

      validEmails.forEach(email => {
        const result = inquirySchema.safeParse({
          name: 'John Doe',
          email,
          phone: '4065551234',
          event_type: 'Wedding',
          message: 'Test message here',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects email longer than 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      const invalidData = {
        name: 'John Doe',
        email: longEmail,
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Inquiry Schema - Phone Validation', () => {
    it('rejects phone shorter than 10 digits', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects phone longer than 20 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1'.repeat(21),
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts various phone formats', () => {
      const validPhones = [
        '4065551234',
        '406-555-1234',
        '(406) 555-1234',
        '+1-406-555-1234',
      ];

      validPhones.forEach(phone => {
        const result = inquirySchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          phone,
          event_type: 'Wedding',
          message: 'Test message here',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Inquiry Schema - Event Type Validation', () => {
    it('accepts all valid event types', () => {
      const validTypes = [
        'Wedding',
        'Engagement',
        'Portrait',
        'Pet',
        'Family',
        'Senior',
        'Proposal',
        'Other',
      ];

      validTypes.forEach(event_type => {
        const result = inquirySchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '4065551234',
          event_type,
          message: 'Test message here',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid event type', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'InvalidType',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects lowercase event type', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Inquiry Schema - Budget Validation', () => {
    it('accepts all valid budget ranges', () => {
      const validBudgets = [
        '<$1000',
        '$1000-$2500',
        '$2500-$5000',
        '$5000+',
        'Not Sure',
      ];

      validBudgets.forEach(budget => {
        const result = inquirySchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '4065551234',
          event_type: 'Wedding',
          message: 'Test message here',
          budget,
        });
        expect(result.success).toBe(true);
      });
    });

    it('accepts null budget', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
        budget: null,
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid budget range', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
        budget: '$10000+',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Inquiry Schema - Message Validation', () => {
    it('rejects message shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Short',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects message longer than 2000 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'A'.repeat(2001),
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts message at minimum length', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'A'.repeat(10),
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts message at maximum length', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'A'.repeat(2000),
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Inquiry Schema - Honeypot Validation', () => {
    it('accepts empty honeypot', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
        honeypot: '',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts missing honeypot field', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts filled honeypot (spam detection happens in route)', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
        honeypot: 'spam content',
      };

      // Schema validation passes, but route handler will reject it
      const result = inquirySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Inquiry Schema - Error Messages', () => {
    it('provides error message for short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      if (!result.success) {
        const nameError = result.error.issues.find(issue => issue.path[0] === 'name');
        expect(nameError?.message).toContain('at least 2 characters');
      }
    });

    it('provides error message for invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      if (!result.success) {
        const emailError = result.error.issues.find(issue => issue.path[0] === 'email');
        expect(emailError?.message).toContain('Invalid email');
      }
    });

    it('provides error message for short phone', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      if (!result.success) {
        const phoneError = result.error.issues.find(issue => issue.path[0] === 'phone');
        expect(phoneError?.message).toContain('at least 10 digits');
      }
    });

    it('provides error message for short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Short',
      };

      const result = inquirySchema.safeParse(invalidData);
      if (!result.success) {
        const messageError = result.error.issues.find(issue => issue.path[0] === 'message');
        expect(messageError?.message).toContain('at least 10 characters');
      }
    });
  });

  describe('Inquiry Schema - Missing Required Fields', () => {
    it('rejects missing name', () => {
      const invalidData = {
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing email', () => {
      const invalidData = {
        name: 'John Doe',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing phone', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing event_type', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
      };

      const result = inquirySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Inquiry Schema - Type Safety', () => {
    it('validates parsed data type', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '4065551234',
        event_type: 'Wedding',
        message: 'Test message here',
      };

      const result = inquirySchema.safeParse(validData);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.event_type).toBe('Wedding');
      }
    });
  });
});

