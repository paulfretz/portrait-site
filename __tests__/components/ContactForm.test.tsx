import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact/ContactForm';

// Mock fetch globally
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Form Rendering', () => {
    it('renders all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('marks required fields with asterisk', () => {
      const { container } = render(<ContactForm />);

      const requiredMarkers = container.querySelectorAll('.text-red-500');
      expect(requiredMarkers.length).toBeGreaterThanOrEqual(4); // name, email, phone, message, event type
    });

    it('renders form heading', () => {
      render(<ContactForm />);

      expect(screen.getByText('Send Me a Message')).toBeInTheDocument();
    });

    it('renders all event type options', () => {
      render(<ContactForm />);

      const eventTypeSelect = screen.getByLabelText(/event type/i) as HTMLSelectElement;
      
      expect(eventTypeSelect).toContainHTML('<option value="">Select an option</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Wedding">Wedding</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Engagement">Engagement</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Portrait">Portrait</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Pet">Pet</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Family">Family</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Senior">Senior</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Proposal">Proposal</option>');
      expect(eventTypeSelect).toContainHTML('<option value="Other">Other</option>');
    });

    it('renders all budget options', () => {
      render(<ContactForm />);

      const budgetSelect = screen.getByLabelText(/budget range/i) as HTMLSelectElement;
      const options = Array.from(budgetSelect.options).map(opt => opt.value);
      
      expect(options).toContain('');
      expect(options).toContain('<$1000');
      expect(options).toContain('$1000-$2500');
      expect(options).toContain('$2500-$5000');
      expect(options).toContain('$5000+');
      expect(options).toContain('Not Sure');
    });
  });

  describe('Form Input Handling', () => {
    it('updates name field on input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');
    });

    it('updates email field on input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      await user.type(emailInput, 'john@example.com');

      expect(emailInput.value).toBe('john@example.com');
    });

    it('updates phone field on input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;
      await user.type(phoneInput, '4065551234');

      expect(phoneInput.value).toBe('4065551234');
    });

    it('updates event type on selection', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const eventTypeSelect = screen.getByLabelText(/event type/i) as HTMLSelectElement;
      await user.selectOptions(eventTypeSelect, 'Wedding');

      expect(eventTypeSelect.value).toBe('Wedding');
    });

    it('updates event date on input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const eventDateInput = screen.getByLabelText(/event date/i) as HTMLInputElement;
      await user.type(eventDateInput, '2024-12-25');

      expect(eventDateInput.value).toBe('2024-12-25');
    });

    it('updates budget on selection', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const budgetSelect = screen.getByLabelText(/budget range/i) as HTMLSelectElement;
      await user.selectOptions(budgetSelect, '$2500-$5000');

      expect(budgetSelect.value).toBe('$2500-$5000');
    });

    it('updates message field on input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageTextarea = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
      await user.type(messageTextarea, 'Looking for a wedding photographer');

      expect(messageTextarea.value).toBe('Looking for a wedding photographer');
    });
  });

  describe('Form Validation', () => {
    it('requires name field', async () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeRequired();
    });

    it('requires email field with email type', async () => {
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('requires phone field', async () => {
      render(<ContactForm />);

      const phoneInput = screen.getByLabelText(/phone/i);
      expect(phoneInput).toBeRequired();
    });

    it('requires event type field', async () => {
      render(<ContactForm />);

      const eventTypeSelect = screen.getByLabelText(/event type/i);
      expect(eventTypeSelect).toBeRequired();
    });

    it('requires message field', async () => {
      render(<ContactForm />);

      const messageTextarea = screen.getByLabelText(/message/i);
      expect(messageTextarea).toBeRequired();
    });

    it('does not require event date field', async () => {
      render(<ContactForm />);

      const eventDateInput = screen.getByLabelText(/event date/i);
      expect(eventDateInput).not.toBeRequired();
    });

    it('does not require budget field', async () => {
      render(<ContactForm />);

      const budgetSelect = screen.getByLabelText(/budget range/i);
      expect(budgetSelect).not.toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('submits form with all required fields filled', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactForm />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Interested in wedding photography');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Verify fetch was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '4065551234',
            event_type: 'Wedding',
            event_date: null,
            budget: null,
            message: 'Interested in wedding photography',
            honeypot: '',
          }),
        });
      });
    });

    it('submits form with optional fields filled', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactForm />);

      // Fill in all fields
      await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065555678');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Engagement');
      await user.type(screen.getByLabelText(/event date/i), '2024-06-15');
      await user.selectOptions(screen.getByLabelText(/budget range/i), '$2500-$5000');
      await user.type(screen.getByLabelText(/message/i), 'Looking for engagement photos');

      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Verify fetch was called with optional fields
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '4065555678',
            event_type: 'Engagement',
            event_date: '2024-06-15',
            budget: '$2500-$5000',
            message: 'Looking for engagement photos',
            honeypot: '',
          }),
        });
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<ContactForm />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Button should be disabled and show loading text
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Sending...');
    });

    it('shows success message on successful submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/thank you for reaching out/i)).toBeInTheDocument();
        expect(screen.getByText(/I'll get back to you within 24 hours/i)).toBeInTheDocument();
      });
    });

    it('clears form fields on successful submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for success and verify fields are cleared
      await waitFor(() => {
        expect(screen.getByText(/thank you for reaching out/i)).toBeInTheDocument();
      });

      expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/phone/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/event type/i) as HTMLSelectElement).value).toBe('');
      expect((screen.getByLabelText(/message/i) as HTMLTextAreaElement).value).toBe('');
    });

    it('shows error message on failed submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Validation failed' }),
      });

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/validation failed/i)).toBeInTheDocument();
      });
    });

    it('shows generic error message on network failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('re-enables submit button after error', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Wait for error and verify button is re-enabled
      await waitFor(() => {
        expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Send Message');
    });
  });

  describe('Accessibility', () => {
    it('associates labels with inputs', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const eventTypeSelect = screen.getByLabelText(/event type/i);
      const messageTextarea = screen.getByLabelText(/message/i);

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(phoneInput).toHaveAttribute('id', 'phone');
      expect(eventTypeSelect).toHaveAttribute('id', 'eventType');
      expect(messageTextarea).toHaveAttribute('id', 'message');
    });

    it('provides placeholder text for inputs', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\(406\) 555-1234/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell me about your vision/i)).toBeInTheDocument();
    });

    it('uses semantic HTML elements', () => {
      const { container } = render(<ContactForm />);

      expect(container.querySelector('form')).toBeInTheDocument();
      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
      expect(container.querySelectorAll('label').length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty optional fields correctly', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactForm />);

      // Fill only required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test');

      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Verify optional fields are sent as null
      await waitFor(() => {
        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.event_date).toBeNull();
        expect(body.budget).toBeNull();
      });
    });

    it('prevents form submission when fetch is in progress', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );

      render(<ContactForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '4065551234');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'Wedding');
      await user.type(screen.getByLabelText(/message/i), 'Test');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Try to submit again while first submission is in progress
      await user.click(submitButton);

      // Fetch should only be called once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

