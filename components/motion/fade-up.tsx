'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

/**
 * Subtle scroll-triggered fade-up. 16px travel, out-expo, once per view.
 * Collapses to a no-op if the user prefers reduced motion.
 */
export function FadeUp({
  delay = 0,
  y = 16,
  duration = 0.5,
  ...rest
}: HTMLMotionProps<'div'> & {
  delay?: number
  y?: number
  duration?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    // biome-ignore lint: simple div fallback
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    />
  )
}
