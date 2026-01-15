'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://eu.i.posthog.com",
      person_profiles: 'always', // Recommended for 2026 
      capture_pageview: false, // Recommended to handle manually in Next.js
      request_batching: false,
      disable_compression: true, 
      api_transport: 'fetch',

        disable_external_dependency_loading: true, 

    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
