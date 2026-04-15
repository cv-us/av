'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Could not send message.')
      }
      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-[var(--border)] p-8 text-center">
        <p className="font-display text-2xl">Thanks — message sent.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot — real users won't fill this */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          required
          minLength={2}
          maxLength={200}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="mt-2"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-[var(--accent)]">
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
