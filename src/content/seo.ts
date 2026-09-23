import type { Metadata } from 'next'
import { site } from './site'

/** Default social card for routes without their own engineering visual. */
export const defaultShareImage = {
  url: '/assets/image/20260827-Sajeevan-Veeriah-Portfolio-OG-Rev00.png',
  width: 1200,
  height: 630,
  alt: `${site.name}, ${site.jobTitle}`,
} as const

/** Shared metadata for the top-level routes, so title, canonical and social cards cannot drift apart. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      type: 'website',
      siteName: site.name,
      locale: 'en_AU',
      images: [defaultShareImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [defaultShareImage.url] },
  }
}
