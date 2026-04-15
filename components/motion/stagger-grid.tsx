'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

/** Parent container — stagger children on mount. */
export function StaggerGrid({
  stagger = 0.04,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { stagger?: number }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: 0.05,
          },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Child item — fade-up 12px. Pair with StaggerGrid. */
export function StaggerItem({
  children,
  ...rest
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
