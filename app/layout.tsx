import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
