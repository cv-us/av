import Image, { type ImageProps } from 'next/image'
import { mediaUrl, type MediaDoc } from '@/lib/media'
import { cn } from '@/lib/utils'

type Props = Omit<ImageProps, 'src' | 'alt' | 'placeholder'> & {
  media: MediaDoc | null | undefined
  size?: 'thumb' | 'card' | 'light' | 'og'
  alt?: string
  className?: string
}

/**
 * Image backed by a Payload media doc → R2 URL.
 * Uses the generated sharp variant for the requested size, and the LQIP
 * base64 blur placeholder for progressive loading.
 */
export function R2Image({
  media,
  size = 'card',
  alt,
  className,
  width,
  height,
  ...rest
}: Props) {
  const src = mediaUrl(media, size)
  if (!src || !media) return null

  const w = width || media.sizes?.[size]?.width || media.width || 1200
  const h = height || media.sizes?.[size]?.height || media.height || 800

  return (
    <Image
      src={src}
      alt={alt ?? media.alt ?? ''}
      width={typeof w === 'number' ? w : 1200}
      height={typeof h === 'number' ? h : 800}
      className={cn('h-auto w-full object-cover', className)}
      placeholder={media.lqip ? 'blur' : 'empty'}
      blurDataURL={media.lqip}
      {...rest}
    />
  )
}
