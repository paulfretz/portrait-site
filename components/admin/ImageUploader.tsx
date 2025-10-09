'use client';

import { useState, useCallback, useRef } from 'react';
import type { Image } from '@/lib/db/types';

/**
 * Image Uploader Component
 * Drag-and-drop or click-to-select image uploader with progress indicators
 *
 * Features:
 * - Drag and drop zone
 * - File selection dialog (click to browse)
 * - Multiple file upload support
 * - Individual progress tracking for each file
 * - Preview thumbnails before upload
 * - File type and size validation
 * - Success/error states
 *
 * Usage:
 * ```tsx
 * <ImageUploader
 *   galleryId="gallery-id"
 *   onUploadComplete={(images) => console.log('Uploaded:', images)}
 * />
 * ```
 *
 * @component
 */

interface ImageUploaderProps {
  galleryId: string;
  onUploadComplete?: (images: Image[]) => void;
  onUploadError?: (error: string) => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function ImageUploader({ galleryId, onUploadComplete, onUploadError }: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Validate files
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: JPEG, PNG, WebP, HEIC`;
    }
    if (file.size > maxSize) {
      return `File too large (max 10MB). This file is ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  };

  // Handle file selection
  const handleFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const error = validateFile(file);

      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  // File input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Upload files
  const uploadFiles = async () => {
    const filesToUpload = files.filter((f) => f.status === 'pending');

    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('gallery_id', galleryId);

      filesToUpload.forEach((fileWithPreview) => {
        formData.append('images', fileWithPreview.file);
      });

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) => (f.status === 'pending' ? { ...f, status: 'uploading' as const } : f))
      );

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Mark all uploaded files as success
      setFiles((prev) =>
        prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'success' as const, progress: 100 } : f))
      );

      // Call success callback
      if (onUploadComplete && data.images) {
        onUploadComplete(data.images);
      }

      // Clear files after a short delay to show success state
      setTimeout(() => {
        setFiles([]);
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);

      // Mark all uploading files as error
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading'
            ? { ...f, status: 'error' as const, error: errorMessage }
            : f
        )
      );

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Clear all files
  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const hasValidFiles = files.some((f) => f.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-sage-500 bg-sage-50'
              : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 text-neutral-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="font-medium text-sage-600">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-neutral-500">JPEG, PNG, WebP, HEIC up to 10MB each</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </p>
            {files.length > 0 && !isUploading && (
              <button
                onClick={clearAll}
                className="text-xs text-neutral-500 hover:text-neutral-700"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {files.map((fileWithPreview, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg"
              >
                {/* Preview thumbnail */}
                <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                  <img
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {/* Status and progress */}
                  {fileWithPreview.status === 'pending' && (
                    <p className="text-xs text-neutral-500 mt-1">Ready to upload</p>
                  )}
                  {fileWithPreview.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="w-full bg-neutral-200 rounded-full h-1.5">
                        <div
                          className="bg-sage-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${fileWithPreview.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {fileWithPreview.status === 'success' && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                  {fileWithPreview.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">✗ {fileWithPreview.error}</p>
                  )}
                </div>

                {/* Remove button */}
                {!isUploading && fileWithPreview.status !== 'success' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          {hasValidFiles && (
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="w-full px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : `Upload ${files.filter((f) => f.status === 'pending').length} ${files.filter((f) => f.status === 'pending').length === 1 ? 'Image' : 'Images'}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

