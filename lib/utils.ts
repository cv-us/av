import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-safe class merger used by shadcn-style components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** URL-safe slug from any string. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

/** "2024" → 2024; defensive against numbers-as-strings. */
export function formatYear(year: number | string | null | undefined): string {
  if (year == null || year === '') return ''
  return String(year)
}

/** Convert Lexical richText JSON to plain text (used for metadata descriptions). */
export function richTextToPlain(
  node: unknown,
  maxLen = 200,
): string {
  if (!node || typeof node !== 'object') return ''
  const root = (node as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  const out: string[] = []
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return
    const obj = n as Record<string, unknown>
    if (typeof obj.text === 'string') out.push(obj.text)
    if (Array.isArray(obj.children)) obj.children.forEach(walk)
  }
  root.children.forEach(walk)
  return out.join(' ').replace(/\s+/g, ' ').trim().slice(0, maxLen)
}
