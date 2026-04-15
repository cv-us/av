'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/reel', label: 'Reel' },
  { href: '/animation', label: 'Animation' },
  { href: '/modeling', label: 'Modeling' },
  { href: '/digital', label: 'Digital' },
  { href: '/drawing', label: 'Drawing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function TopNav({ displayName }: { displayName: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--bg)_92%,transparent)] backdrop-blur-md">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6"
      >
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-[var(--ink)] hover:text-[var(--accent)]"
        >
          {displayName}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm transition-colors',
                    active
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ink)] md:hidden"
          >
            <Menu size={20} aria-hidden />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-[var(--ink)]/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-72 flex-col gap-2 bg-[var(--bg)] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg">{displayName}</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ink)]"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-lg text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
