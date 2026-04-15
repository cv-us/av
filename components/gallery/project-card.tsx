'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { R2Image } from '@/components/media/r2-image'
import { resolveMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Project = Record<string, any>

export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: Project
  priority?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const cover = resolveMedia(project.coverMedia)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn('group block', className)}
    >
      <div className="relative overflow-hidden">
        <motion.div
          whileHover={reduced ? {} : { scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="will-change-transform"
        >
          {cover ? (
            <R2Image media={cover} size="card" priority={priority} />
          ) : (
            <div
              className="w-full bg-[var(--surface)]"
              style={{ aspectRatio: '4 / 3' }}
            />
          )}
        </motion.div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--accent)]">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="mt-0.5 text-sm text-[var(--muted)]">{project.subtitle}</p>
          )}
        </div>
        <div className="shrink-0 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
          {project.year && <span>{project.year}</span>}
          {project.role && project.year && <span className="mx-1.5">·</span>}
          {project.role && <span>{project.role}</span>}
        </div>
      </div>
    </Link>
  )
}
