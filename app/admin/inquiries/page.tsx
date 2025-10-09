import { Metadata } from 'next';
import { InquiryDashboard } from '@/components/admin/InquiryDashboard';

export const metadata: Metadata = {
  title: 'Inquiries | Admin Dashboard',
  description: 'Manage contact form inquiries and client submissions',
};

export default function InquiriesPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <InquiryDashboard />
      </div>
    </div>
  );
}

