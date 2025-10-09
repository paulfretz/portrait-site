import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'DJ Coveno Portraits',
  description:
    'Montana portrait photographer specializing in weddings, engagements, families, and more in Bozeman, Big Sky, and Yellowstone areas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminToolbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
