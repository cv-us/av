'use client'

import { useCallback, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { mediaUrl, type MediaDoc } from '@/lib/media'
import { ModelViewer } from '@/components/media/model-viewer'
import { VideoFile } from '@/components/media/video-file'
import { MuxClip } from '@/components/media/mux-clip'

export type LightboxItem = MediaDoc

/**
 * Portaled lightbox with a Framer Motion `layoutId` shared-element
 * morph between the thumbnail and the full-size media.
 *
 * Usage: pass the clicked thumbnail's media `id` as `layoutId` on the
 * triggering <motion.img> so the hero image morphs from grid to modal.
 */
export function Lightbox({
  items,
  startIndex,
  open,
  onOpenChange,
}: {
  items: LightboxItem[]
  startIndex: number
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    if (open) setIndex(startIndex)
  }, [open, startIndex])

  const go = useCallback(
    (dir: number) =>
      setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, go])

  const item = items[index]
  if (!item) return null

  const fullUrl = mediaUrl(item, 'light') || mediaUrl(item)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-[var(--ink)]/85 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              aria-describedby={undefined}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dialog.Title className="sr-only">
                  {item.alt || 'Artwork'}
                </Dialog.Title>

                <motion.div
                  layoutId={reduced ? undefined : `media-${item.id}`}
                  className="relative flex max-h-full max-w-[min(1400px,95vw)] items-center justify-center"
                  drag={items.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1)
                    else if (info.offset.x > 80) go(-1)
                  }}
                >
                  {item.mediaKind === 'video' && item.muxPlaybackId ? (
                    <MuxClip
                      playbackId={item.muxPlaybackId}
                      title={item.alt}
                      className="w-[min(90vw,1200px)]"
                    />
                  ) : item.mediaKind === 'video' && fullUrl ? (
                    <VideoFile src={fullUrl} className="max-h-[85vh] max-w-[90vw]" />
                  ) : item.mediaKind === 'glb' && fullUrl ? (
                    <ModelViewer
                      src={fullUrl}
                      alt={item.alt || 'Interactive 3D model'}
                      className="w-[min(90vw,1000px)]"
                    />
                  ) : fullUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fullUrl}
                      alt={item.alt || ''}
                      className="max-h-[85vh] max-w-[90vw] object-contain"
                    />
                  ) : null}
                </motion.div>

                {item.caption && (
                  <p className="absolute bottom-6 left-1/2 max-w-xl -translate-x-1/2 text-center text-sm text-[var(--bg)]/80">
                    {item.caption}
                  </p>
                )}

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous"
                      onClick={() => go(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-[var(--bg)] hover:bg-white/10"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next"
                      onClick={() => go(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-[var(--bg)] hover:bg-white/10"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}

                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-full p-2 text-[var(--bg)] hover:bg-white/10"
                  >
                    <X size={24} />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
