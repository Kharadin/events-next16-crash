import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
          {protocol: 'https',
            hostname: 'res.cloudinary.com',
          }
    ]

  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "eu-assets.i.posthog.com*",
      },
      {
        source: "/ingest/:path*",
        destination: "eu.i.posthog.com*",
      },
      {
        source: "/ingest/decide",
        destination: "eu.i.posthog.com",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
