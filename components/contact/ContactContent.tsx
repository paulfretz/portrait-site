'use client';

import { InlineEditor } from '@/components/admin/InlineEditor';
import { useEditMode } from '@/lib/admin/edit-mode-context';
import { useAuth } from '@/lib/auth/auth-context';
import { useState, ReactNode } from 'react';

interface ContactContentProps {
  heroHeadline: string;
  heroDescription: string;
  getInTouchDescription: string;
  email: string;
  phone: string;
  serviceArea: string;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  children?: ReactNode;
}

export function ContactContent({
  heroHeadline: initialHeroHeadline,
  heroDescription: initialHeroDescription,
  getInTouchDescription: initialGetInTouchDescription,
  email: initialEmail,
  phone: initialPhone,
  serviceArea: initialServiceArea,
  instagramUrl: initialInstagramUrl,
  facebookUrl: initialFacebookUrl,
  pinterestUrl: initialPinterestUrl,
  children,
}: ContactContentProps) {
  const { editMode } = useEditMode();
  const { isAdmin } = useAuth();
  const [heroHeadline, setHeroHeadline] = useState(initialHeroHeadline);
  const [heroDescription, setHeroDescription] = useState(initialHeroDescription);
  const [getInTouchDescription, setGetInTouchDescription] = useState(
    initialGetInTouchDescription
  );
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [serviceArea, setServiceArea] = useState(initialServiceArea);
  const [instagramUrl, setInstagramUrl] = useState(initialInstagramUrl);
  const [facebookUrl, setFacebookUrl] = useState(initialFacebookUrl);
  const [pinterestUrl, setPinterestUrl] = useState(initialPinterestUrl);

  const isEditable = editMode && isAdmin;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <InlineEditor
              page="contact"
              section="hero-headline"
              initialValue={heroHeadline}
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6"
              onSave={setHeroHeadline}
            />
            <InlineEditor
              page="contact"
              section="hero-description"
              initialValue={heroDescription}
              as="p"
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
              onSave={setHeroDescription}
            />
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-serif text-gray-900 mb-6">Get In Touch</h2>
                <InlineEditor
                  page="contact"
                  section="get-in-touch-description"
                  initialValue={getInTouchDescription}
                  as="p"
                  className="text-gray-600 leading-relaxed mb-8"
                  onSave={setGetInTouchDescription}
                />

                {/* Contact Details */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-sage-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${email}`}
                        className="text-sage-600 hover:text-sage-700 transition-colors"
                      >
                        <InlineEditor
                          page="contact"
                          section="email"
                          initialValue={email}
                          as="span"
                          className="text-sage-600 hover:text-sage-700 transition-colors"
                          onSave={setEmail}
                        />
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-sage-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Phone</h3>
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-sage-600 hover:text-sage-700 transition-colors"
                      >
                        <InlineEditor
                          page="contact"
                          section="phone"
                          initialValue={phone}
                          as="span"
                          className="text-sage-600 hover:text-sage-700 transition-colors"
                          onSave={setPhone}
                        />
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-sage-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Service Area</h3>
                      <InlineEditor
                        page="contact"
                        section="service-area"
                        initialValue={serviceArea}
                        as="p"
                        className="text-gray-600 whitespace-pre-line"
                        onSave={setServiceArea}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-sage-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Follow Along</h3>
                      <div className="flex gap-3">
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-sage-600 transition-colors"
                          aria-label="Instagram"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                        <a
                          href={facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-sage-600 transition-colors"
                          aria-label="Facebook"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                        <a
                          href={pinterestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-sage-600 transition-colors"
                          aria-label="Pinterest"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                          </svg>
                        </a>
                      </div>
                      {isEditable && (
                        <div className="mt-3 text-xs text-gray-500 space-y-1">
                          <div>
                            <span className="font-medium">Instagram:</span>{' '}
                            <InlineEditor
                              page="contact"
                              section="instagram-url"
                              initialValue={instagramUrl}
                              as="span"
                              className="text-sage-600"
                              onSave={setInstagramUrl}
                            />
                          </div>
                          <div>
                            <span className="font-medium">Facebook:</span>{' '}
                            <InlineEditor
                              page="contact"
                              section="facebook-url"
                              initialValue={facebookUrl}
                              as="span"
                              className="text-sage-600"
                              onSave={setFacebookUrl}
                            />
                          </div>
                          <div>
                            <span className="font-medium">Pinterest:</span>{' '}
                            <InlineEditor
                              page="contact"
                              section="pinterest-url"
                              initialValue={pinterestUrl}
                              as="span"
                              className="text-sage-600"
                              onSave={setPinterestUrl}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>{children}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

