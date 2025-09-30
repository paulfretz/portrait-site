import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
