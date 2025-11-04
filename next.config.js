/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Configure remote image patterns for Supabase Storage, Vercel Blob, and Cloudflare R2
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Image optimization settings for photography site
    // Aligned with our generated variants: 400, 1200, 2400, 4000
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 800, 1200, 1600, 2400, 4000],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable compression
  compress: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // Webpack optimizations for smaller bundles
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
