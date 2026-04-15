import { cn } from '@/lib/utils'

/**
 * Clean Vimeo embed — no title/byline/portrait, accent ring on controls.
 */
export function VimeoEmbed({
  videoId,
  title = 'Demo reel',
  className,
  autoplay = false,
}: {
  videoId: string
  title?: string
  className?: string
  autoplay?: boolean
}) {
  const params = new URLSearchParams({
    title: '0',
    byline: '0',
    portrait: '0',
    color: 'B85C38',
    dnt: '1',
    ...(autoplay ? { autoplay: '1', muted: '1' } : {}),
  })

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface)]',
        className,
      )}
      style={{ aspectRatio: '16 / 9' }}
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?${params.toString()}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
