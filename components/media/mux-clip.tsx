'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// MuxPlayer pulls in heavy HLS support — defer it to the client.
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse bg-[var(--surface)]"
      style={{ aspectRatio: '16 / 9' }}
    />
  ),
})

export function MuxClip({
  playbackId,
  title,
  poster,
  className,
}: {
  playbackId: string
  title?: string
  poster?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface)]',
        className,
      )}
      style={{ aspectRatio: '16 / 9' }}
    >
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        poster={poster}
        accentColor="#B85C38"
        streamType="on-demand"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
