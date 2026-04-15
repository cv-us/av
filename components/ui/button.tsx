'use client'

import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--ink)] text-[var(--bg)] hover:opacity-90',
        ghost:
          'text-[var(--ink)] hover:bg-[var(--surface)] border border-transparent',
        outline:
          'border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface)]',
        link:
          'text-[var(--ink)] underline-offset-4 hover:underline decoration-[var(--accent)]',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-5',
        lg: 'h-12 px-7',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
