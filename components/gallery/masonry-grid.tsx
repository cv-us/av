'use client'

import { cn } from '@/lib/utils'
import { StaggerGrid, StaggerItem } from '@/components/motion/stagger-grid'

/**
 * CSS-columns based masonry.  No JS layout, resizes cheaply,
 * tolerates any image aspect ratio.
 */
export function MasonryGrid({
  children,
  className,
  columns = 'sm:columns-2 lg:columns-3',
}: {
  children: React.ReactNode[]
  className?: string
  columns?: string
}) {
  return (
    <StaggerGrid className={cn('columns-1', columns, 'gap-6', className)}>
      {children.map((child, i) => (
        <StaggerItem key={i} className="mb-6 break-inside-avoid">
          {child}
        </StaggerItem>
      ))}
    </StaggerGrid>
  )
}
