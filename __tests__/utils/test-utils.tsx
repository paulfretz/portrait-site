/**
 * Test Utilities
 * Custom render functions and helpers for component testing
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { EditModeProvider } from '@/lib/admin/edit-mode-context'

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of RTL's render for components that need context
 */
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <AuthProvider>
      <EditModeProvider>
        {children}
      </EditModeProvider>
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }

/**
 * Mock Supabase client for tests
 */
export const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithOAuth: jest.fn(() => Promise.resolve({ data: null, error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: null, error: null })),
      remove: jest.fn(() => Promise.resolve({ data: null, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://test.url/image.jpg' } })),
    })),
  },
}

/**
 * Mock authenticated user
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'admin@test.com',
  user_metadata: {
    full_name: 'Test Admin',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
}

/**
 * Mock gallery data for tests
 */
export const mockGallery = {
  id: 'test-gallery-id',
  category_id: 'test-category-id',
  title: 'Test Gallery',
  slug: 'test-gallery',
  description: 'A test gallery description',
  date: '2024-01-01',
  location: 'Big Sky, Montana',
  cover_image_id: 'test-cover-image-id',
  display_order: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

/**
 * Mock category data for tests
 */
export const mockCategory = {
  id: 'test-category-id',
  name: 'Weddings',
  slug: 'weddings',
  description: 'Wedding photography',
  display_order: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

/**
 * Mock image data for tests
 */
export const mockImage = {
  id: 'test-image-id',
  gallery_id: 'test-gallery-id',
  url: 'https://test.url/image.jpg',
  alt_text: 'Test image alt text',
  width: 1920,
  height: 1080,
  display_order: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

/**
 * Mock inquiry data for tests
 */
export const mockInquiry = {
  id: 'test-inquiry-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '406-555-0100',
  event_type: 'Wedding' as const,
  event_date: '2024-06-15',
  budget: '$2000-$3000' as const,
  message: 'Interested in wedding photography',
  status: 'New' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

/**
 * Wait for async updates (useful for state changes)
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0))

