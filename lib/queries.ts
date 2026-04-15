import 'server-only'
import { cache } from 'react'
import { payload } from './payload'

/** All published projects, optionally filtered by category slug. */
export const getProjects = cache(async (categorySlug?: string) => {
  const p = await payload()
  const where: Record<string, unknown> = {
    status: { equals: 'published' },
  }
  if (categorySlug) {
    // Resolve category by slug first so we can filter by id
    const cats = await p.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })
    const catId = cats.docs[0]?.id
    if (!catId) return []
    where.category = { equals: catId }
  }

  const res = await p.find({
    collection: 'projects',
    where,
    sort: 'sortOrder',
    limit: 200,
    depth: 2,
  })
  return res.docs
})

/** Featured projects (for the landing page). */
export const getFeaturedProjects = cache(async (limit = 6) => {
  const p = await payload()
  const res = await p.find({
    collection: 'projects',
    where: {
      and: [
        { status: { equals: 'published' } },
        { featured: { equals: true } },
      ],
    },
    sort: 'sortOrder',
    limit,
    depth: 2,
  })
  return res.docs
})

/** Single project by slug. Returns null if not found or not published. */
export const getProjectBySlug = cache(async (slug: string) => {
  const p = await payload()
  const res = await p.find({
    collection: 'projects',
    where: {
      and: [
        { status: { equals: 'published' } },
        { slug: { equals: slug } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

/** Slugs for every published project (used by sitemap + static params). */
export const getAllProjectSlugs = cache(async () => {
  const p = await payload()
  const res = await p.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 500,
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
  })
  return res.docs as Array<{ slug: string; updatedAt: string }>
})

/** All visible categories. */
export const getCategories = cache(async () => {
  const p = await payload()
  const res = await p.find({
    collection: 'categories',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
  })
  return res.docs
})

/** Site-wide settings (tagline, bio, reel, résumé, links). */
export const getSiteSettings = cache(async () => {
  const p = await payload()
  return p.findGlobal({ slug: 'siteSettings', depth: 2 })
})
