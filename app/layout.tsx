import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { EditModeProvider } from '@/lib/admin/edit-mode-context';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'DJ Coveno Portraits',
  description:
    'Montana portrait photographer specializing in weddings, engagements, families, and more in Bozeman, Big Sky, and Yellowstone areas',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8B9D83',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://nmgptiywaefuvvatlcah.supabase.co" />
      </head>
      <body>
        <AuthProvider>
          <EditModeProvider>
            <AdminToolbar />
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </EditModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
