import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/queries'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/reel',
    '/animation',
    '/modeling',
    '/digital',
    '/drawing',
    '/about',
    '/contact',
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: p === '' ? 1 : 0.8,
  }))

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getAllProjectSlugs()
    projectRoutes = slugs.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {
    // DB unavailable at build time on first deploy — return static only
  }

  return [...staticRoutes, ...projectRoutes]
}
