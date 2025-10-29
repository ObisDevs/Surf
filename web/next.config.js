/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: experimental optimization options removed to avoid optional
  // peer dependency requirements during build (e.g., 'critters').
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
