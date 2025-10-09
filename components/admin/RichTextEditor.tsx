'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditMode } from '@/lib/admin/edit-mode-context';
import { useAuth } from '@/lib/auth/auth-context';

interface RichTextEditorProps {
  page: string;
  section: string;
  initialValue: string;
  placeholder?: string;
  className?: string;
  onSave?: (value: string) => void;
}

/**
 * RichTextEditor Component
 * Allows admins to edit rich text content with basic formatting
 *
 * Features:
 * - Bold, italic, underline formatting
 * - Bulleted and numbered lists
 * - Links
 * - Paragraph breaks
 * - Only editable when user is logged in and Edit Mode is active
 * - Auto-saves to database via /api/content endpoint
 *
 * Note: Uses contentEditable for simplicity. For more advanced features,
 * consider integrating a library like Tiptap or Lexical in the future.
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   page="about"
 *   section="bio"
 *   initialValue="<p>I'm a photographer...</p>"
 *   className="prose"
 * />
 * ```
 */
export function RichTextEditor({
  page,
  section,
  initialValue,
  placeholder = 'Click to edit...',
  className = '',
  onSave,
}: RichTextEditorProps) {
  const { editMode } = useEditMode();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialValue);

  // Update content when initialValue changes
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  // Update editor content when entering edit mode
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = content;
      editorRef.current.focus();
    }
  }, [isEditing, content]);

  const handleClick = () => {
    if (editMode && isAdmin && !isEditing) {
      setIsEditing(true);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const newContent = editorRef.current.innerHTML;
    
    if (newContent === content) {
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
          content_type: 'rich_text',
          content: newContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setContent(newContent);
      setSaveStatus('success');
      setIsEditing(false);

      if (onSave) {
        onSave(newContent);
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
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
    setIsEditing(false);
    setSaveStatus('idle');
  };

  // Show editable UI when in edit mode and admin
  const isEditable = editMode && isAdmin;

  if (isEditing) {
    return (
      <div className="relative">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-neutral-100 rounded-md border border-neutral-300">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h12M6 6h12M6 18h12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4 italic" fill="currentColor" viewBox="0 0 24 24">
              <text x="8" y="18" fontSize="16" fontStyle="italic">I</text>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h10M7 4v8a5 5 0 0010 0V4" />
            </svg>
          </button>
          <span className="w-px bg-neutral-300 mx-1" />
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </button>
          <span className="w-px bg-neutral-300 mx-1" />
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            className="p-2 hover:bg-neutral-200 rounded transition-colors"
            title="Insert Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
        </div>

        {/* Editable Content Area */}
        <div
          ref={editorRef}
          contentEditable
          className={`${className} border-2 border-sage-500 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-sage-600 min-h-[100px]`}
          suppressContentEditableWarning
        />

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
    <div
      onClick={handleClick}
      className={`${className} ${
        isEditable
          ? 'cursor-pointer border-2 border-dashed border-transparent hover:border-sage-300 rounded-md transition-colors relative group'
          : ''
      }`}
      title={isEditable ? 'Click to edit' : undefined}
      dangerouslySetInnerHTML={{ __html: content || placeholder }}
    >
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
    </div>
  );
}

