/**
 * One-time seed: creates the 5 discipline categories and pre-fills
 * siteSettings education with Citrus College + CSU Northridge.
 *
 * Run: bun run seed
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const CATEGORIES = [
  { slug: 'reel', name: 'Demo Reel', sortOrder: 0 },
  { slug: 'animation', name: '3D Animation', sortOrder: 1 },
  { slug: 'modeling', name: '3D Modeling', sortOrder: 2 },
  { slug: 'digital', name: 'Digital Art', sortOrder: 3 },
  { slug: 'drawing', name: 'Traditional & Life Drawing', sortOrder: 4 },
]

const EDUCATION = [
  {
    institution: 'California State University, Northridge',
    degree: 'BA, Art — Animation Option (3D Track)',
    years: '',
    notes:
      'CSUN animation program; DreamWorks Animation educational partnership; member of Associated Students League of Animators (ASLN).',
  },
  {
    institution: 'Citrus College',
    degree: 'AA, Art (pre-transfer coursework)',
    years: '',
    notes: 'Foundations: life drawing, figure, composition.',
  },
]

async function main() {
  const payload = await getPayload({ config })

  // Categories — upsert by slug
  for (const c of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'categories',
        data: { ...c, visible: true },
      })
      console.log(`+ category: ${c.slug}`)
    } else {
      console.log(`= category exists: ${c.slug}`)
    }
  }

  // SiteSettings — set defaults if empty
  const settings = await payload.findGlobal({ slug: 'siteSettings' })
  const hasEducation =
    Array.isArray((settings as { education?: unknown[] }).education) &&
    ((settings as { education?: unknown[] }).education?.length ?? 0) > 0

  if (!hasEducation) {
    await payload.updateGlobal({
      slug: 'siteSettings',
      data: {
        displayName: settings.displayName || 'Your Name',
        tagline: settings.tagline || 'Character Animator · 3D Generalist',
        education: EDUCATION,
      },
    })
    console.log('+ siteSettings education seeded')
  } else {
    console.log('= siteSettings education already present')
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
