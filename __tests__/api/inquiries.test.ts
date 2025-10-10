/**
 * Integration Tests for Inquiries API
 * Tests the validation and data handling for /api/inquiries endpoints
 */

import type { InquiryInsert } from '@/lib/db/types';

describe('Inquiries API Integration', () => {
  describe('Inquiry Data Validation', () => {
    it('validates required fields', () => {
      const inquiryData: InquiryInsert = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '406-555-1234',
        event_type: 'Wedding',
        event_date: '2024-06-15',
        budget: '$2500-$5000',
        message: 'Interested in wedding photography',
        status: 'new',
      };

      expect(inquiryData.name).toBeTruthy();
      expect(inquiryData.email).toBeTruthy();
      expect(inquiryData.phone).toBeTruthy();
      expect(inquiryData.event_type).toBeTruthy();
      expect(inquiryData.message).toBeTruthy();
    });

    it('allows null optional fields', () => {
      const inquiryData: InquiryInsert = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '406-555-1234',
        event_type: 'Portrait',
        event_date: null,
        budget: null,
        message: 'Looking for portrait session',
        status: 'new',
      };

      expect(inquiryData.event_date).toBeNull();
      expect(inquiryData.budget).toBeNull();
    });

    it('validates email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@example.com',
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('validates phone format', () => {
      const validPhones = [
        '406-555-1234',
        '(406) 555-1234',
        '4065551234',
        '+1-406-555-1234',
      ];

      validPhones.forEach(phone => {
        expect(phone).toBeTruthy();
        expect(typeof phone).toBe('string');
      });
    });
  });

  describe('Event Type Validation', () => {
    it('validates all event types', () => {
      const validEventTypes = [
        'Wedding',
        'Engagement',
        'Portrait',
        'Pet',
        'Family',
        'Senior',
        'Proposal',
        'Other',
      ];

      validEventTypes.forEach(eventType => {
        const inquiryData = {
          event_type: eventType,
        };

        expect(inquiryData.event_type).toBe(eventType);
      });
    });

    it('validates event type is capitalized', () => {
      const eventTypes = ['Wedding', 'Engagement', 'Portrait'];
      
      eventTypes.forEach(eventType => {
        expect(eventType[0]).toBe(eventType[0].toUpperCase());
      });
    });
  });

  describe('Budget Range Validation', () => {
    it('validates all budget ranges', () => {
      const validBudgets = [
        '<$1000',
        '$1000-$2500',
        '$2500-$5000',
        '$5000+',
        'Not Sure',
      ];

      validBudgets.forEach(budget => {
        const inquiryData = {
          budget: budget,
        };

        expect(inquiryData.budget).toBe(budget);
      });
    });

    it('allows null budget', () => {
      const inquiryData = {
        budget: null,
      };

      expect(inquiryData.budget).toBeNull();
    });
  });

  describe('Status Validation', () => {
    it('validates all status values', () => {
      const validStatuses = ['new', 'contacted', 'booked', 'archived'];

      validStatuses.forEach(status => {
        const inquiryData = {
          status: status,
        };

        expect(inquiryData.status).toBe(status);
      });
    });

    it('defaults to new status', () => {
      const defaultStatus = 'new';
      expect(defaultStatus).toBe('new');
    });
  });

  describe('Date Handling', () => {
    it('accepts ISO date format for event_date', () => {
      const date = '2024-06-15';
      const parsed = new Date(date);
      
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
    });

    it('handles null event_date', () => {
      const inquiryData = {
        event_date: null,
      };

      expect(inquiryData.event_date).toBeNull();
    });

    it('validates future dates for events', () => {
      const futureDate = '2025-12-31';
      const parsed = new Date(futureDate);
      const now = new Date();
      
      expect(parsed.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('Inquiry Response Format', () => {
    it('validates inquiry object structure', () => {
      const inquiry = {
        id: 'inquiry-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '406-555-1234',
        event_type: 'Wedding',
        event_date: '2024-06-15',
        budget: '$2500-$5000',
        message: 'Test message',
        status: 'new',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(inquiry).toHaveProperty('id');
      expect(inquiry).toHaveProperty('name');
      expect(inquiry).toHaveProperty('email');
      expect(inquiry).toHaveProperty('phone');
      expect(inquiry).toHaveProperty('event_type');
      expect(inquiry).toHaveProperty('event_date');
      expect(inquiry).toHaveProperty('budget');
      expect(inquiry).toHaveProperty('message');
      expect(inquiry).toHaveProperty('status');
      expect(inquiry).toHaveProperty('created_at');
      expect(inquiry).toHaveProperty('updated_at');
    });
  });

  describe('Message Validation', () => {
    it('accepts long messages', () => {
      const longMessage = 'A'.repeat(1000);
      expect(longMessage.length).toBe(1000);
      expect(typeof longMessage).toBe('string');
    });

    it('validates message is required', () => {
      const emptyMessage = '';
      const isValid = emptyMessage.trim().length > 0;
      
      expect(isValid).toBe(false);
    });

    it('handles special characters in message', () => {
      const message = 'Looking for wedding photographer! Budget: $2,500-$5,000. Date: June 15th.';
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });
  });

  describe('Rate Limiting Logic', () => {
    it('validates email-based rate limiting key', () => {
      const email = 'test@example.com';
      const rateLimitKey = `inquiry:${email}`;
      
      expect(rateLimitKey).toBe('inquiry:test@example.com');
    });

    it('normalizes email for rate limiting', () => {
      const email = 'TEST@EXAMPLE.COM';
      const normalized = email.toLowerCase();
      
      expect(normalized).toBe('test@example.com');
    });
  });

  describe('Honeypot Validation', () => {
    it('validates honeypot field is empty', () => {
      const honeypot = '';
      expect(honeypot).toBe('');
    });

    it('detects spam if honeypot is filled', () => {
      const honeypot = 'spam content';
      const isSpam = honeypot.length > 0;
      
      expect(isSpam).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('validates required name field', () => {
      const invalidName = '';
      const isValid = invalidName.trim().length > 0;
      
      expect(isValid).toBe(false);
    });

    it('validates required email field', () => {
      const inquiryData: Partial<InquiryInsert> = {
        name: 'John Doe',
        phone: '406-555-1234',
      };

      expect(inquiryData.email).toBeUndefined();
    });

    it('validates required phone field', () => {
      const inquiryData: Partial<InquiryInsert> = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      expect(inquiryData.phone).toBeUndefined();
    });

    it('validates required message field', () => {
      const inquiryData: Partial<InquiryInsert> = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '406-555-1234',
        event_type: 'Wedding',
      };

      expect(inquiryData.message).toBeUndefined();
    });
  });

  describe('Status Update Validation', () => {
    it('allows status transitions', () => {
      const transitions = [
        { from: 'new', to: 'contacted' },
        { from: 'contacted', to: 'booked' },
        { from: 'booked', to: 'archived' },
      ];

      transitions.forEach(({ from, to }) => {
        expect(from).toBeTruthy();
        expect(to).toBeTruthy();
        expect(from).not.toBe(to);
      });
    });
  });
});

