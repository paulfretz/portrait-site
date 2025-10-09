'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditMode } from '@/lib/admin/edit-mode-context';
import { useAuth } from '@/lib/auth/auth-context';

interface InlineEditorProps {
  page: string;
  section: string;
  contentType?: 'text' | 'textarea';
  initialValue: string;
  placeholder?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  onSave?: (value: string) => void;
}

/**
 * InlineEditor Component
 * Allows admins to edit text content directly on the page when in Edit Mode
 *
 * Features:
 * - Only editable when user is logged in and Edit Mode is active
 * - Displays content normally when not in edit mode
 * - Shows edit border and hover state in edit mode
 * - Auto-saves to database via /api/content endpoint
 * - Supports different HTML elements (h1, h2, h3, p, span)
 * - Supports single-line text or multi-line textarea
 *
 * @example
 * ```tsx
 * <InlineEditor
 *   page="homepage"
 *   section="hero-headline"
 *   initialValue="Capturing Life's Beautiful Moments"
 *   as="h1"
 *   className="text-4xl font-serif"
 * />
 * ```
 */
export function InlineEditor({
  page,
  section,
  contentType = 'text',
  initialValue,
  placeholder = 'Click to edit...',
  className = '',
  as: Element = 'p',
  onSave,
}: InlineEditorProps) {
  const { editMode } = useEditMode();
  const { isAdmin } = useAuth();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (editMode && isAdmin && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          section,
          content_type: 'text',
          content: value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setSaveStatus('success');
      setIsEditing(false);
      
      if (onSave) {
        onSave(value);
      }

      // Clear success status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    setSaveStatus('idle');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (contentType === 'text' && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Show editable UI when in edit mode and admin
  const isEditable = editMode && isAdmin;

  if (isEditing) {
    return (
      <div className="relative">
        {contentType === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full border-2 border-sage-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sage-600`}
            rows={4}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full border-2 border-sage-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sage-600`}
            placeholder={placeholder}
          />
        )}

        {/* Save/Cancel Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors text-sm font-medium disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium disabled:bg-gray-100"
          >
            Cancel
          </button>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <p className="text-sm text-sage-600 mt-2">✓ Saved successfully</p>
        )}
        {saveStatus === 'error' && (
          <p className="text-sm text-red-600 mt-2">✗ Failed to save. Please try again.</p>
        )}
      </div>
    );
  }

  // Display mode
  return (
    <Element
      onClick={handleClick}
      className={`${className} ${
        isEditable
          ? 'cursor-pointer border-2 border-dashed border-transparent hover:border-sage-300 rounded-md transition-colors relative group'
          : ''
      }`}
      title={isEditable ? 'Click to edit' : undefined}
    >
      {value || placeholder}
      
      {/* Edit icon on hover */}
      {isEditable && (
        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-sage-600 text-white rounded-full shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>
        </span>
      )}
    </Element>
  );
}

