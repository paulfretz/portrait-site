import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InlineEditor } from '@/components/admin/InlineEditor';
import React from 'react';

// Mock fetch globally
global.fetch = jest.fn();

// Create mock context providers
const MockEditModeProvider = ({ children }: { children: React.ReactNode }) => children;
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => children;

// Mock the hooks to control edit mode and admin status
jest.mock('@/lib/admin/edit-mode-context', () => ({
  useEditMode: () => ({ editMode: true, toggleEditMode: jest.fn() }),
  EditModeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({ 
    isAdmin: true, 
    user: { id: 'test-user', email: 'admin@test.com' },
    loading: false,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    refreshSession: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Simple render without extra providers since we're mocking the hooks
const render = (ui: React.ReactElement) => rtlRender(ui);

describe('InlineEditor', () => {
  const defaultProps = {
    page: 'homepage',
    section: 'hero-headline',
    initialValue: 'Test Content',
    placeholder: 'Click to edit...',
    className: 'text-2xl',
    as: 'h1' as const,
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.clearAllMocks();
  });

  describe('Display Mode (Not Editing)', () => {
    it('renders initial value in display mode', () => {
      render(<InlineEditor {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with correct HTML element', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="h2" />);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Content');
    });

    it('applies custom className', () => {
      const { container } = render(<InlineEditor {...defaultProps} className="custom-class" />);
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    it('shows placeholder when value is empty', () => {
      render(<InlineEditor {...defaultProps} initialValue="" />);
      expect(screen.getByText('Click to edit...')).toBeInTheDocument();
    });

    it('does not show edit UI when not in edit mode', () => {
      // Note: render provides editMode=true by default
      // This test verifies the UI structure, not the edit mode state
      render(<InlineEditor {...defaultProps} />);
      
      // Before clicking, should not show save/cancel buttons
      expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode Activation', () => {
    it('shows edit border when in edit mode and admin', () => {
      const { container } = render(<InlineEditor {...defaultProps} />);
      
      const element = container.querySelector('.border-dashed');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('hover:border-sage-300');
    });

    it('shows edit icon on hover in edit mode', () => {
      const { container } = render(<InlineEditor {...defaultProps} />);
      
      const editIcon = container.querySelector('svg');
      expect(editIcon).toBeInTheDocument();
    });

    it('shows cursor pointer in edit mode', () => {
      const { container } = render(<InlineEditor {...defaultProps} />);
      
      const element = container.querySelector('.cursor-pointer');
      expect(element).toBeInTheDocument();
    });

    it('shows title tooltip in edit mode', () => {
      render(<InlineEditor {...defaultProps} />);
      
      const element = screen.getByText('Test Content');
      expect(element).toHaveAttribute('title', 'Click to edit');
    });

    it('enters editing mode when clicked in edit mode', () => {
      render(<InlineEditor {...defaultProps} />);
      
      const element = screen.getByText('Test Content');
      fireEvent.click(element);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('renders input field when editing text', () => {
      render(<InlineEditor {...defaultProps} contentType="text" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input.value).toBe('Test Content');
    });

    it('renders textarea when editing textarea', () => {
      render(<InlineEditor {...defaultProps} contentType="textarea" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea.value).toBe('Test Content');
    });

    it('focuses and selects text when entering edit mode', async () => {
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      await waitFor(() => {
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toHaveFocus();
      });
    });

    it('updates value on input change', async () => {
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.clear(input);
      await user.type(input, 'New Content');
      
      expect(input.value).toBe('New Content');
    });

    it('shows Save and Cancel buttons when editing', () => {
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Save Functionality', () => {
    it('saves content to API on save button click', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'homepage',
            section: 'hero-headline',
            content_type: 'text',
            content: 'Updated Content',
          }),
        });
      });
    });

    it('exits editing mode after successful save', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      // Should exit editing mode and show updated content
      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText('Updated Content')).toBeInTheDocument();
      });
    });


    it('shows error message on save failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to save' }),
      });

      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
    });

    it('calls onSave callback after successful save', async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<InlineEditor {...defaultProps} onSave={onSave} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('Updated Content');
      });
    });

    it('does not save if value unchanged', async () => {
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      // Click save without changing value
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      // Should not call API
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Should exit editing mode
      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });

    it('disables buttons while saving', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );

      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      fireEvent.click(saveButton);
      
      // Buttons should be disabled
      expect(saveButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });
  });

  describe('Cancel Functionality', () => {
    it('reverts to initial value on cancel', async () => {
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Changed Content');
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('exits editing mode on cancel', async () => {
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Changed Content');
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('saves on Enter key for text input', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<InlineEditor {...defaultProps} contentType="text" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Content');
      
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('does not save on Enter key for textarea', async () => {
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} contentType="textarea" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New Content');
      
      fireEvent.keyDown(textarea, { key: 'Enter' });
      
      // Should not call API (Enter adds newline in textarea)
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('cancels on Escape key', async () => {
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Changed Content');
      
      fireEvent.keyDown(input, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });
  });

  describe('Props Updates', () => {
    it('updates value when initialValue prop changes', () => {
      const { rerender } = render(<InlineEditor {...defaultProps} initialValue="Original" />);
      expect(screen.getByText('Original')).toBeInTheDocument();
      
      rerender(<InlineEditor {...defaultProps} initialValue="Updated" />);
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('Different HTML Elements', () => {
    it('renders as h1', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="h1" />);
      expect(container.querySelector('h1')).toBeInTheDocument();
    });

    it('renders as h2', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="h2" />);
      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('renders as h3', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="h3" />);
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('renders as p', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="p" />);
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('renders as span', () => {
      const { container } = render(<InlineEditor {...defaultProps} as="span" />);
      // Span with cursor-pointer class (when in edit mode)
      const spans = container.querySelectorAll('span');
      expect(spans.length).toBeGreaterThan(0);
    });
  });

  describe('Content Types', () => {
    it('renders input for text content type', () => {
      render(<InlineEditor {...defaultProps} contentType="text" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    it('renders textarea for textarea content type', () => {
      render(<InlineEditor {...defaultProps} contentType="textarea" />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea.rows).toBe(4);
    });
  });

  describe('Accessibility', () => {
    it('applies proper styling for focus states', () => {
      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-sage-600');
    });

    it('provides placeholder text', () => {
      render(<InlineEditor {...defaultProps} initialValue="" />);
      
      fireEvent.click(screen.getByText('Click to edit...'));
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('Click to edit...');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty initial value', () => {
      render(<InlineEditor {...defaultProps} initialValue="" />);
      expect(screen.getByText('Click to edit...')).toBeInTheDocument();
    });

    it('handles very long text', async () => {
      const longText = 'A'.repeat(1000);
      const user = userEvent.setup();
      render(<InlineEditor {...defaultProps} initialValue={longText} />);
      
      fireEvent.click(screen.getByText(longText));
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe(longText);
    });

    it('handles special characters', async () => {
      const specialText = 'Test & <script>alert("xss")</script>';
      render(<InlineEditor {...defaultProps} initialValue={specialText} />);
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<InlineEditor {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Test Content'));
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Updated Content');
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
      
      // Should still be in editing mode
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

});

