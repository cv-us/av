/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Minimal Lexical → HTML renderer for Payload richText output.
 * Handles paragraphs, headings, lists, links, and inline marks (bold/italic).
 * Kept small on purpose — we don't need every Lexical node type here.
 */
import { cn } from '@/lib/utils'

type Node = {
  type?: string
  tag?: string
  text?: string
  url?: string
  format?: number
  listType?: 'bullet' | 'number'
  children?: Node[]
  version?: number
  fields?: { url?: string; newTab?: boolean }
}

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_UNDERLINE = 8

function renderChildren(nodes: Node[] | undefined, keyPrefix = ''): React.ReactNode {
  if (!nodes) return null
  return nodes.map((n, i) => renderNode(n, `${keyPrefix}-${i}`))
}

function renderNode(node: Node, key: string): React.ReactNode {
  if (!node) return null
  const { type } = node

  if (type === 'text') {
    const f = node.format || 0
    let el: React.ReactNode = node.text ?? ''
    if (f & IS_BOLD) el = <strong>{el}</strong>
    if (f & IS_ITALIC) el = <em>{el}</em>
    if (f & IS_UNDERLINE) el = <span className="underline">{el}</span>
    return <span key={key}>{el}</span>
  }

  if (type === 'linebreak') return <br key={key} />

  if (type === 'link') {
    const url = node.fields?.url || node.url || '#'
    return (
      <a
        key={key}
        href={url}
        target={node.fields?.newTab ? '_blank' : undefined}
        rel={node.fields?.newTab ? 'noreferrer noopener' : undefined}
        className="underline underline-offset-4 decoration-[var(--accent)]"
      >
        {renderChildren(node.children, key)}
      </a>
    )
  }

  if (type === 'heading') {
    const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
    const sizes: Record<string, string> = {
      h1: 'font-display text-4xl md:text-5xl tracking-tight',
      h2: 'font-display text-3xl md:text-4xl tracking-tight mt-12 mb-4',
      h3: 'font-display text-2xl mt-8 mb-3',
      h4: 'font-display text-xl mt-6 mb-2',
    }
    return (
      <Tag key={key} className={sizes[String(Tag)] || ''}>
        {renderChildren(node.children, key)}
      </Tag>
    )
  }

  if (type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <Tag
        key={key}
        className={cn(
          'my-4 ml-6 space-y-1 text-base',
          Tag === 'ul' ? 'list-disc' : 'list-decimal',
        )}
      >
        {renderChildren(node.children, key)}
      </Tag>
    )
  }

  if (type === 'listitem') {
    return <li key={key}>{renderChildren(node.children, key)}</li>
  }

  if (type === 'quote') {
    return (
      <blockquote
        key={key}
        className="my-6 border-l-2 border-[var(--accent)] pl-5 italic text-[var(--muted)]"
      >
        {renderChildren(node.children, key)}
      </blockquote>
    )
  }

  // default = paragraph
  return (
    <p key={key} className="my-4 leading-relaxed">
      {renderChildren(node.children, key)}
    </p>
  )
}

export function RichText({
  data,
  className,
}: {
  data: any
  className?: string
}) {
  if (!data?.root?.children) return null
  return (
    <div className={cn('measure text-[var(--ink)]', className)}>
      {renderChildren(data.root.children as Node[])}
    </div>
  )
}
