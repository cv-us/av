import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Payload + sharp out of the serverless bundle per Vercel + Payload v3 guide
  serverExternalPackages: ['payload', 'sharp'],
  images: {
    remotePatterns: [
      // R2 public bucket (custom domain set via env at build time)
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
            },
          ]
        : []),
      // Vimeo & Mux poster hosts for thumbnails
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
  experimental: {
    // Payload needs this flag for server-side streaming
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
