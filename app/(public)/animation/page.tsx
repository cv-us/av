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
    title: '3D Animation',
    description: 'Character acting, body mechanics, creature, and dialogue animation work.',
    path: '/animation',
    displayName: name,
  })
}

export default async function AnimationPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects('animation')
  } catch {}

  return (
    <>
      <DisciplineHeader
        eyebrow="Discipline"
        title="3D Animation"
        intro="Character acting, body mechanics, creature, and dialogue shots. Each project links to a detail page with shot breakdown, software, and credits for any non-self-made rigs."
      />
      {/* @ts-ignore — Payload doc shape is loose */}
      <ProjectGrid projects={projects} />
    </>
  )
}
