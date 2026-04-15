'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Lightbox, type LightboxItem } from './lightbox'
import { mediaUrl } from '@/lib/media'
import { cn } from '@/lib/utils'

/**
 * Grid of media thumbnails that open the shared-element lightbox on click.
 * Used on project detail pages and discipline masonry pages.
 */
export function MediaGallery({
  items,
  className,
  columns = 'sm:grid-cols-2 md:grid-cols-3',
}: {
  items: LightboxItem[]
  className?: string
  columns?: string
}) {
  const [open, setOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const reduced = useReducedMotion()

  return (
    <>
      <div className={cn('grid grid-cols-1 gap-3', columns, className)}>
        {items.map((item, i) => {
          const thumb = mediaUrl(item, 'card') || mediaUrl(item, 'thumb') || mediaUrl(item)
          if (!thumb) return null
          const ar =
            item.width && item.height
              ? `${item.width} / ${item.height}`
              : '4 / 3'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setStartIndex(i)
                setOpen(true)
              }}
              className="group relative block overflow-hidden bg-[var(--surface)]"
              style={{ aspectRatio: ar }}
              aria-label={`Open ${item.alt || 'media'}`}
            >
              <motion.img
                layoutId={reduced ? undefined : `media-${item.id}`}
                src={thumb}
                alt={item.alt || ''}
                className="absolute inset-0 h-full w-full object-cover"
                whileHover={reduced ? {} : { scale: 1.03 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                loading="lazy"
              />
              {item.mediaKind === 'video' && (
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-[var(--ink)]/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[var(--bg)]">
                  Video
                </span>
              )}
              {item.mediaKind === 'glb' && (
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-[var(--ink)]/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[var(--bg)]">
                  3D
                </span>
              )}
            </button>
          )
        })}
      </div>
      <Lightbox
        items={items}
        startIndex={startIndex}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
