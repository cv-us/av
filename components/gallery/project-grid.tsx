'use client'

import { StaggerGrid, StaggerItem } from '@/components/motion/stagger-grid'
import { ProjectCard } from './project-card'
import { cn } from '@/lib/utils'

type Project = {
  id: string
  slug: string
  title: string
  subtitle?: string
  role?: string
  year?: number
  coverMedia?: unknown
}

export function ProjectGrid({
  projects,
  variant = 'standard',
  className,
}: {
  projects: Project[]
  /** 'standard' = 3-col uniform; 'editorial' = asymmetric for landing. */
  variant?: 'standard' | 'editorial'
  className?: string
}) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-[var(--muted)]">
        New work coming soon.
      </div>
    )
  }

  return (
    <StaggerGrid
      className={cn(
        variant === 'editorial'
          ? 'grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12'
          : 'grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {projects.map((p, i) => (
        <StaggerItem
          key={p.id}
          className={
            variant === 'editorial'
              ? i % 3 === 0
                ? 'md:col-span-7'
                : i % 3 === 1
                  ? 'md:col-span-5 md:mt-24'
                  : 'md:col-span-6'
              : undefined
          }
        >
          <ProjectCard project={p} priority={i < 2} />
        </StaggerItem>
      ))}
    </StaggerGrid>
  )
}
