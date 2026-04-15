import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs uppercase tracking-[0.08em] text-[var(--muted)]',
      className,
    )}
    {...props}
  />
))
Label.displayName = 'Label'
