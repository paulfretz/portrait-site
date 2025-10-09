'use client';

import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { InlineEditor } from '@/components/admin/InlineEditor';
import { useEditMode } from '@/lib/admin/edit-mode-context';
import { useAuth } from '@/lib/auth/auth-context';
import Image from 'next/image';
import { useState, useRef } from 'react';

interface AboutContentProps {
  bioTitle: string;
  bioContent: string;
  experienceContent: string;
  approachContent: string;
  profilePhotoUrl?: string | null;
}

export function AboutContent({
  bioTitle: initialBioTitle,
  bioContent: initialBioContent,
  experienceContent: initialExperienceContent,
  approachContent: initialApproachContent,
  profilePhotoUrl: initialProfilePhotoUrl,
}: AboutContentProps) {
  const { editMode } = useEditMode();
  const { isAdmin } = useAuth();
  const [bioTitle, setBioTitle] = useState(initialBioTitle);
  const [bioContent, setBioContent] = useState(initialBioContent);
  const [experienceContent, setExperienceContent] = useState(initialExperienceContent);
  const [approachContent, setApproachContent] = useState(initialApproachContent);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(initialProfilePhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditable = editMode && isAdmin;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', 'DJ Coveno profile photo');
      formData.append('gallery_id', 'profile'); // Special gallery ID for profile photos

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const uploadedUrl = data.images?.[0]?.url;

      if (uploadedUrl) {
        setProfilePhotoUrl(uploadedUrl);

        // Save profile photo URL to page_content
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 'about',
            section: 'profile-photo-url',
            content_type: 'text',
            content: uploadedUrl,
          }),
        });
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Profile Photo Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Profile Photo */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-sage-100 to-sage-200 shadow-lg group">
                  {profilePhotoUrl ? (
                    <Image
                      src={profilePhotoUrl}
                      alt="DJ Coveno profile photo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-sage-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Upload Button (only visible in edit mode) */}
                  {isEditable && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <div className="text-center text-white">
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                              <span className="text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-12 h-12 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                {profilePhotoUrl ? 'Change Photo' : 'Upload Photo'}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio Summary */}
              <div className="w-full md:w-2/3">
                <InlineEditor
                  page="about"
                  section="bio-title"
                  initialValue={bioTitle}
                  as="h2"
                  className="text-3xl md:text-4xl font-serif text-gray-900 mb-4"
                  onSave={setBioTitle}
                />
                <RichTextEditor
                  page="about"
                  section="bio-content"
                  initialValue={bioContent}
                  className="text-lg text-gray-600 leading-relaxed prose prose-lg max-w-none"
                  onSave={setBioContent}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
              Experience & Background
            </h2>
            <RichTextEditor
              page="about"
              section="experience-content"
              initialValue={experienceContent}
              className="prose prose-lg max-w-none"
              onSave={setExperienceContent}
            />
          </div>
        </div>
      </section>

      {/* Philosophy/Approach Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 text-center">
              My Approach to Photography
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Authentic */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Authentic</h3>
                <p className="text-gray-600">
                  I capture genuine emotions and real moments, not forced poses or artificial
                  smiles.
                </p>
              </div>

              {/* Natural */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Natural Light</h3>
                <p className="text-gray-600">
                  I work with natural light whenever possible, creating soft, timeless images.
                </p>
              </div>

              {/* Storytelling */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Storytelling</h3>
                <p className="text-gray-600">
                  Every session tells a story. I focus on the narrative, not just the individual
                  shots.
                </p>
              </div>
            </div>

            <RichTextEditor
              page="about"
              section="approach-content"
              initialValue={approachContent}
              className="prose prose-lg max-w-none"
              onSave={setApproachContent}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-sage-50 to-sage-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              I'd love to hear about your vision and discuss how we can work together to capture
              your special moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/galleries"
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                View My Work
              </a>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors font-medium"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

