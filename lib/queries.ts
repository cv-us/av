/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only'
import { cache } from 'react'
import { payload } from './payload'

// Payload generates strict types after first dev run via
// `payload generate:types`. Until that file exists we use loose shapes
// so build-time TS is happy and runtime behaviour is unchanged.
type DocLike = Record<string, any>

/** All published projects, optionally filtered by category slug. */
export const getProjects = cache(async (categorySlug?: string): Promise<DocLike[]> => {
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
  return res.docs as DocLike[]
})

/** Featured projects (for the landing page). */
export const getFeaturedProjects = cache(async (limit = 6): Promise<DocLike[]> => {
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
  return res.docs as DocLike[]
})

/** Single project by slug. Returns null if not found or not published. */
export const getProjectBySlug = cache(async (slug: string): Promise<DocLike | null> => {
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
  return (res.docs[0] as DocLike) ?? null
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
export const getCategories = cache(async (): Promise<DocLike[]> => {
  const p = await payload()
  const res = await p.find({
    collection: 'categories',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
  })
  return res.docs as DocLike[]
})

/** Site-wide settings (tagline, bio, reel, résumé, links). */
export const getSiteSettings = cache(async (): Promise<DocLike> => {
  const p = await payload()
  return (await p.findGlobal({ slug: 'siteSettings', depth: 2 })) as DocLike
})
