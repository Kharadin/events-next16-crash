# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This is a small Next.js 16 application using the App Router (`app/`), TypeScript, and Tailwind CSS v4-style setup (via `@import "tailwindcss"` in `app/globals.css`). It renders a single landing page that lists featured events and includes a custom WebGL-based background effect.

Key technologies:
- Next.js 16 (`app` directory, `next.config.ts`)
- React 19 with TypeScript (`tsconfig.json`)
- Tailwind + `tw-animate-css` for styling/utilities (`app/globals.css`)
- PostHog client analytics (`instrumentation-client.ts`, `next.config.ts` rewrites)
- `ogl` for the `LightRays` WebGL effect

## Commands

All commands below assume `npm` and a shell rooted at the project directory.

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

- Serves the app at `http://localhost:3000`.
- Hot-reloads when you edit files like `app/page.tsx`.

### Build for production

```bash
npm run build
```

- Runs `next build` using `next.config.ts`.

### Start production server

```bash
npm run start
```

- Serves the built app (after `npm run build`).

### Linting

```bash
npm run lint
```

- Uses `eslint` with `eslint-config-next` (core web vitals + TypeScript) configured in `eslint.config.mjs`.

### Tests

- There is currently **no test runner or `test` script** defined in `package.json`, and no `*.test.*` files in the repo.
- To add tests in the future (e.g., Jest/Vitest/Playwright), create the corresponding config and `"test"`/`"test:watch"` scripts and update this section.

## High-level architecture

### Routing and layout (Next.js App Router)

- Global entry and layout are in `app/layout.tsx`:
  - Applies global fonts via `next/font/google` (`Schibsted_Grotesk`, `Martian_Mono`).
  - Imports `app/globals.css` for Tailwind and custom layers.
  - Renders the global `<Navbar />` and `<LightRays />` background wrapper around `<main>{children}</main>`.
  - Exports `metadata` (title/description) for the whole app.
- The main landing page is `app/page.tsx`:
  - Uses `EventCard` and `ExploreBtn` components.
  - Reads static event data from `lib/constants.ts` and maps it into `<EventCard />` instances.
  - Currently renders a single page section; the `slug` fields imply future detail routes like `/events/[slug]`, but such routes are not yet implemented.

### UI components

All components are colocated under `components/` and imported via TypeScript path aliases (`@/components/*`). Key pieces:

- `components/Navbar.tsx`
  - Top navigation bar, rendered on every page via `RootLayout`.
  - Uses `next/image` and `next/link` and static assets under `public/icons`.
- `components/EventCard.tsx`
  - Card view for a single event, driven by the `EventItem` type from `lib/constants.ts`.
  - Links to `/events/${slug}` using `next/link` (future-proofing for detail pages).
  - Displays location, date, and time with iconography from `public/icons`.
- `components/ExploreBtn.tsx`
  - Client component (`"use client"`) rendering a CTA button that scrolls to the `#events` section.
  - Currently logs a click to the console; no analytics integration yet.
- `components/LightRays.tsx`
  - Client component implementing a full-screen, GPU-accelerated light rays effect using `ogl`.
  - Uses WebGL shaders (embedded GLSL strings) with a `Renderer`, `Program`, `Triangle`, and `Mesh`.
  - Accepts props to control ray origin, color, speed, spread, length, mouse-follow behavior, noise, and distortion.
  - Manages WebGL lifecycle manually: sets up renderer, attaches a `<canvas>` to a container div, handles `resize` events, and cleans up on unmount or when the component goes out of view.
  - Uses `IntersectionObserver` to pause work when not visible, and `requestAnimationFrame` for the render loop.

### Styling system

- Global styling is centralized in `app/globals.css`:
  - Imports Tailwind via `@import "tailwindcss";` and `tw-animate-css`.
  - Defines a CSS custom-properties palette under `:root` (background, foreground, primary, sidebar, chart colors, radii, etc.).
  - Uses the Tailwind v4 `@theme inline` API to bridge custom properties into Tailwind color/radius tokens.
  - Declares custom `@utility` shortcuts (`flex-center`, `text-gradient`, `glass`, `card-shadow`).
  - `@layer base` sets global `body`, `main`, heading, and list styles, including container sizing.
  - `@layer components` defines higher-level component styles keyed by selectors/IDs (`#home`, `#explore-btn`, `header nav`, `.events`, `#event-card`, `#event`, `.pill`, `#book-event`). These styles drive the layout and appearance of `Navbar`, `EventCard`, and related sections.

### Data and utilities

- `lib/constants.ts`
  - Defines the `EventItem` TypeScript type (image, title, slug, location, date, time).
  - Exports a static `events: EventItem[]` array used by `app/page.tsx` to render the featured events list.
- `lib/utils.ts`
  - Exports `cn(...inputs)` helper, a standard `clsx` + `tailwind-merge` combo for conditional className composition.

### Configuration and tooling

- `tsconfig.json`
  - Configures TypeScript for a Next.js app using the App Router and React 19 types.
  - Important alias: `"@/*": ["./*"]`, enabling imports like `@/components/...` and `@/lib/...`.
- `next.config.ts`
  - Defines `rewrites()` sending `"/ingest/static/:path*"` and `"/ingest/:path*"` to PostHog EU endpoints.
  - Sets `skipTrailingSlashRedirect: true` to support PostHog trailing-slash API requests.
- `instrumentation-client.ts`
  - Initializes the PostHog browser SDK (`posthog-js`) using `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
  - Enables `capture_exceptions` and toggles debug mode in development.
  - When integrating this into the app, be mindful to only import it on the client (e.g., via client components or `useEffect`).
- `eslint.config.mjs`
  - Uses the new flat config API via `defineConfig`.
  - Extends Next.js `core-web-vitals` and TypeScript presets.
  - Globally ignores build artifacts (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`).
- `components.json`
  - shadcn/ui-style configuration specifying aliases (`components`, `utils`, `ui`, `lib`, `hooks`) and the Tailwind entry CSS file (`app/globals.css`).
  - If you use shadcn generators, they will respect these aliases and styling conventions.

## Notes for future Warp usage

- Use the `@/*` path alias when adding new modules under `components/`, `lib/`, or other top-level folders.
- If you introduce tests, update `package.json` scripts and this `WARP.md` with how to run all tests and individual tests.
- For significant UI changes, keep styles consistent with the existing Tailwind utilities and the CSS custom properties defined in `app/globals.css`.