import type { Metadata } from 'next'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type BuildOpts = {
  title?: string
  description?: string
  path?: string
  ogImage?: string | null
  siteName?: string
  displayName?: string
}

/** Build a consistent Metadata object for App Router pages. */
export function buildMetadata({
  title,
  description,
  path = '/',
  ogImage,
  siteName,
  displayName,
}: BuildOpts): Metadata {
  const base = siteName || displayName || 'Portfolio'
  const fullTitle = title ? `${title} · ${base}` : base
  const url = new URL(path, SITE_URL).toString()
  const image = ogImage || `${SITE_URL}/og/default`

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: base,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

/** JSON-LD Person schema for /about. */
export function personSchema(opts: {
  name: string
  url: string
  sameAs?: string[]
  jobTitle?: string
  alumniOf?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    url: opts.url,
    jobTitle: opts.jobTitle,
    sameAs: opts.sameAs,
    alumniOf: opts.alumniOf?.map((name) => ({
      '@type': 'EducationalOrganization',
      name,
    })),
  }
}

/** JSON-LD CreativeWork schema for project detail pages. */
export function creativeWorkSchema(opts: {
  name: string
  description?: string
  creator: string
  url: string
  image?: string
  dateCreated?: string | number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    dateCreated: opts.dateCreated ? String(opts.dateCreated) : undefined,
    creator: {
      '@type': 'Person',
      name: opts.creator,
    },
  }
}
