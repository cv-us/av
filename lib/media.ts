/**
 * Media helpers — Payload upload documents → URL + alt for rendering.
 * Deliberately loose typing because Payload's generated types aren't
 * available until after first run.
 */

export type MediaDoc = {
  id: string
  url?: string
  alt?: string
  caption?: string
  mimeType?: string
  width?: number
  height?: number
  mediaKind?: 'image' | 'video' | 'glb' | 'pdf'
  muxPlaybackId?: string
  filename?: string
  sizes?: Record<string, { url?: string; width?: number; height?: number }>
  lqip?: string
}

/** Pick the best URL for a given size key (thumb/card/light/og/original). */
export function mediaUrl(
  doc: MediaDoc | null | undefined,
  size?: 'thumb' | 'card' | 'light' | 'og',
): string | undefined {
  if (!doc) return undefined
  if (size && doc.sizes?.[size]?.url) return doc.sizes[size]!.url
  return doc.url
}

/** Normalise a Payload upload relationship which can be string | object. */
export function resolveMedia(
  v: unknown,
): MediaDoc | null {
  if (!v) return null
  if (typeof v === 'string') return null // id-only; caller must populate
  return v as MediaDoc
}

/** Ratio helper for CSS aspect-ratio. */
export function aspectRatio(doc: MediaDoc | null | undefined): number | undefined {
  if (!doc?.width || !doc?.height) return undefined
  return doc.width / doc.height
}
