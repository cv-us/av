'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * <model-viewer> web component wrapper. Loads Google's module lazily
 * the first time a GLB is rendered, so it costs zero bytes elsewhere.
 */
export function ModelViewer({
  src,
  poster,
  alt,
  className,
}: {
  src: string
  poster?: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only load once per session.
    if (typeof window === 'undefined') return
    if ((window as unknown as { __mvLoaded?: boolean }).__mvLoaded) return

    const s = document.createElement('script')
    s.type = 'module'
    s.src =
      'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
    document.head.appendChild(s)
    ;(window as unknown as { __mvLoaded?: boolean }).__mvLoaded = true
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface)]',
        className,
      )}
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* @ts-ignore — custom element, not in React's JSX types */}
      <model-viewer
        src={src}
        alt={alt}
        poster={poster}
        camera-controls=""
        auto-rotate=""
        auto-rotate-delay="3000"
        shadow-intensity="1"
        exposure="0.9"
        interaction-prompt="auto"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  )
}
