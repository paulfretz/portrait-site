'use client';

import { useEffect, useState } from 'react';
import type { Inquiry } from '@/lib/db/types';

type InquiryStatus = 'new' | 'contacted' | 'booked' | 'archived';

export function InquiryDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, searchQuery]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setInquiries(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return '🆕';
      case 'contacted':
        return '💬';
      case 'booked':
        return '✅';
      case 'archived':
        return '📁';
      default:
        return '📧';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-2">Manage contact form submissions and client inquiries</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by name or email
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="booked">Booked</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-neutral-300 mx-auto mb-4"
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
            <p className="text-gray-500">No inquiries found</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'New inquiries will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{inquiry.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {getStatusIcon(inquiry.status)} {inquiry.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        📧 <a href={`mailto:${inquiry.email}`} className="hover:text-sage-600">
                          {inquiry.email}
                        </a>
                      </p>
                      <p>
                        📱 <a href={`tel:${inquiry.phone}`} className="hover:text-sage-600">
                          {inquiry.phone}
                        </a>
                      </p>
                      <p>
                        🎭 {inquiry.event_type}
                        {inquiry.event_date && (
                          <> • 📅 {new Date(inquiry.event_date).toLocaleDateString()}</>
                        )}
                        {inquiry.budget && <> • 💰 {inquiry.budget}</>}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Submitted {new Date(inquiry.created_at).toLocaleDateString()} at{' '}
                        {new Date(inquiry.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-2">
                    {selectedInquiry.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedInquiry.status
                    )}`}
                  >
                    {getStatusIcon(selectedInquiry.status)} {selectedInquiry.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <span className="w-24 font-medium">Email:</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-sage-600 hover:text-sage-700"
                    >
                      {selectedInquiry.email}
                    </a>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="w-24 font-medium">Phone:</span>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-sage-600 hover:text-sage-700"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Event Details
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <span className="w-24 font-medium">Type:</span>
                    {selectedInquiry.event_type}
                  </p>
                  {selectedInquiry.event_date && (
                    <p className="flex items-center text-gray-700">
                      <span className="w-24 font-medium">Date:</span>
                      {new Date(selectedInquiry.event_date).toLocaleDateString()}
                    </p>
                  )}
                  {selectedInquiry.budget && (
                    <p className="flex items-center text-gray-700">
                      <span className="w-24 font-medium">Budget:</span>
                      {selectedInquiry.budget}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Message
                </h3>
                <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Submission Details
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(selectedInquiry.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Update Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'new')}
                    disabled={selectedInquiry.status === 'new'}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🆕 New
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'contacted')}
                    disabled={selectedInquiry.status === 'contacted'}
                    className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💬 Contacted
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'booked')}
                    disabled={selectedInquiry.status === 'booked'}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Booked
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'archived')}
                    disabled={selectedInquiry.status === 'archived'}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📁 Archive
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-gray-700 rounded-md hover:bg-neutral-50 transition-colors font-medium"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="px-4 py-2 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors font-medium"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

