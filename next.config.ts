import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript : {
    ignoreBuildErrors: true
  },
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
      // {
      //   source: "/ingest/static/:path*",
      //   destination: "https://eu-assets.i.posthog.com/static/:path*",
      // },
        {
      source: "/ingest/static/:path*",
      destination: "https://eu-assets.i.posthog.com/:path*",
    },
      // {
      //   source: "/ingest/:path*",
      //   destination: "https://eu.i.posthog.com/:path*",
      // },
      // {
      //   source: "/ingest/decide",
      //   destination: "https://eu.i.posthog.com/decide",
      // },
          {
      // Using :path* as a catch-all handles /array/, /s/, /e/, and /decide/
      source: "/ingest/:path*",
      destination: "https://eu.i.posthog.com/:path*",
    },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
