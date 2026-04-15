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
    title: 'Digital Art',
    description: 'Concept art, illustration, and paintover studies.',
    path: '/digital',
    displayName: name,
  })
}

export default async function DigitalPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects('digital')
  } catch {}

  return (
    <>
      <DisciplineHeader
        eyebrow="Discipline"
        title="Digital Art"
        intro="Concept art, illustrations, and paintover studies bridging traditional foundations with the 3D work."
      />
      {/* @ts-expect-error — Payload doc shape is loose */}
      <ProjectGrid projects={projects} />
    </>
  )
}
