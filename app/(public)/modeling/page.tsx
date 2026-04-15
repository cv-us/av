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
    title: '3D Modeling',
    description: 'Characters, props, and environments with turntables, wireframes, and interactive GLB models.',
    path: '/modeling',
    displayName: name,
  })
}

export default async function ModelingPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects('modeling')
  } catch {}

  return (
    <>
      <DisciplineHeader
        eyebrow="Discipline"
        title="3D Modeling"
        intro="Characters, props, and environments. Each project includes turntables (shaded, wireframe, textured, deformation passes) and — where available — an interactive GLB you can rotate in the browser."
      />
      {/* @ts-expect-error — Payload doc shape is loose */}
      <ProjectGrid projects={projects} />
    </>
  )
}
