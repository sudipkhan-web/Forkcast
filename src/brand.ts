/**
 * Single source of truth for the app's brand.
 *
 * To rebrand again, change the values here — that's it. (Forkcast → Kondivore done 2026-10-08.)
 * - All screens, notifications and the voice assistant read BRAND from this file.
 * - index.html, public/manifest.json and public/firebase-messaging-sw.js contain
 *   __BRAND_NAME__ / __BRAND_DESCRIPTION__ placeholders that vite.config.ts fills
 *   in from this file (in dev and in the production build).
 *
 * Still separate from this file: app icons (public/icon-192.png, icon-512.png),
 * package.json "name" and metadata.json (internal, not user-facing).
 */
export const BRAND = {
  /** Shown on every screen, in notifications, the browser tab and the home-screen icon label. */
  name: 'Kondivore',
  /** Short line under the name on the sign-in screen. */
  tagline: 'Less waste. Less thinking. Better meals.',
  /** Used by the installable-app (PWA) manifest. */
  description: 'Fuel your training. Know what to eat, when.',
} as const;
