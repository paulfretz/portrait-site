'use client';

import { useEffect, useState } from 'react';

interface UploadProgressBarProps {
  fileName: string;
  fileSize: number; // in bytes
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

/**
 * Upload Progress Bar Component
 * Displays upload progress for large file uploads with percentage, file size, and status
 *
 * @param fileName - Name of the file being uploaded
 * @param fileSize - Size of the file in bytes
 * @param progress - Upload progress from 0-100
 * @param status - Current upload status
 * @param error - Error message if status is 'error'
 */
export default function UploadProgressBar({
  fileName,
  fileSize,
  progress,
  status,
  error,
}: UploadProgressBarProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Track elapsed time and estimate remaining time
  useEffect(() => {
    if (status !== 'uploading' && status !== 'processing') {
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedTime(elapsed);

      // Estimate remaining time based on progress
      if (progress > 0 && progress < 100) {
        const estimatedTotal = (elapsed / progress) * 100;
        const remaining = estimatedTotal - elapsed;
        setEstimatedTimeRemaining(remaining > 0 ? remaining : null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [status, progress]);

  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-sage-green';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing image...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Preparing...';
    }
  };

  return (
    <div className="w-full space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* File info header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{fileName}</p>
          <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
        </div>
        <div className="ml-4 text-right">
          <p className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</p>
          {status === 'uploading' && estimatedTimeRemaining !== null && (
            <p className="text-xs text-gray-500">~{formatTime(estimatedTimeRemaining)} left</p>
          )}
          {status === 'processing' && (
            <p className="text-xs text-gray-500">Processing...</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status message */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{getStatusText()}</p>
        {elapsedTime > 0 && status !== 'complete' && (
          <p className="text-xs text-gray-500">Elapsed: {formatTime(elapsedTime)}</p>
        )}
      </div>

      {/* Error message */}
      {error && status === 'error' && (
        <div className="mt-2 rounded-md bg-red-50 p-2">
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* Success message */}
      {status === 'complete' && (
        <div className="mt-2 rounded-md bg-green-50 p-2">
          <p className="text-xs text-green-800">
            Image uploaded and optimized successfully! ({formatTime(elapsedTime)})
          </p>
        </div>
      )}
    </div>
  );
}

