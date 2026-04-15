import Link from 'next/link'

type Links = {
  email?: string
  linkedin?: string
  vimeo?: string
  instagram?: string
  artstation?: string
}

export function Footer({
  displayName,
  links,
}: {
  displayName: string
  links: Links
}) {
  const year = new Date().getFullYear()
  const ext = [
    links.vimeo && { label: 'Vimeo', href: links.vimeo },
    links.linkedin && { label: 'LinkedIn', href: links.linkedin },
    links.artstation && { label: 'ArtStation', href: links.artstation },
    links.instagram && { label: 'Instagram', href: links.instagram },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="mt-32 border-t border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-base text-[var(--ink)]">
          {displayName}
        </p>
        <nav aria-label="Secondary" className="flex flex-wrap items-center gap-5 text-sm text-[var(--muted)]">
          <Link href="/about" className="hover:text-[var(--ink)]">
            About
          </Link>
          <Link href="/contact" className="hover:text-[var(--ink)]">
            Contact
          </Link>
          {ext.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-[var(--ink)]"
            >
              {l.label}
            </a>
          ))}
          {links.email && (
            <a
              href={`mailto:${links.email}`}
              className="hover:text-[var(--ink)]"
            >
              {links.email}
            </a>
          )}
        </nav>
      </div>
      <p className="pb-8 text-center text-xs text-[var(--muted)]">
        © {year} {displayName}. All artwork rights reserved.
      </p>
    </footer>
  )
}
