import type { Metadata } from 'next'
import { DisciplineHeader } from '@/components/gallery/discipline-header'
import { ProjectGrid } from '@/components/gallery/project-grid'
import { getProjects, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  let name = 'Portfolio'
  try {
    name = (await getSiteSettings()).displayName || name
  } catch {}
  return buildMetadata({
    title: 'Traditional & Life Drawing',
    description: 'Gesture, sustained figure, anatomy studies, master copies, and sketchbook spreads.',
    path: '/drawing',
    displayName: name,
  })
}

export default async function DrawingPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects('drawing')
  } catch {}

  return (
    <>
      <DisciplineHeader
        eyebrow="Fundamentals"
        title="Traditional & Life Drawing"
        intro="Gesture, sustained figure, anatomy studies, master copies, and sketchbook spreads. Disney has run in-house life drawing classes since 1932 — fundamentals are not optional."
      />
      {/* @ts-expect-error — Payload doc shape is loose */}
      <ProjectGrid
        projects={projects}
        className="sm:grid-cols-2 lg:grid-cols-4"
      />
    </>
  )
}
