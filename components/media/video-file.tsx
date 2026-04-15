import { cn } from '@/lib/utils'

/** Plain MP4 player (for clips that don't need Mux adaptive streaming). */
export function VideoFile({
  src,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
}: {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}) {
  return (
    <video
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      className={cn('h-auto w-full bg-[var(--surface)]', className)}
    />
  )
}
