'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const ORDER = ['system', 'light', 'dark'] as const
type Mode = (typeof ORDER)[number]

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const current: Mode = (theme as Mode) || 'system'

  const cycle = () => {
    const idx = ORDER.indexOf(current)
    setTheme(ORDER[(idx + 1) % ORDER.length])
  }

  const label = {
    light: 'Switch to dark mode',
    dark: 'Switch to system theme',
    system: 'Switch to light mode',
  }[current]

  const Icon = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }[current]

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-[var(--ink)] hover:border-[var(--border)] hover:bg-[var(--surface)]',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={current}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <Icon size={18} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
