import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-6">
      <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
        404
      </p>
      <h1 className="font-display mt-3 text-5xl tracking-tight">
        Not here.
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        The page you&apos;re looking for has moved, been renamed, or doesn&apos;t
        exist yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-[var(--accent)]"
      >
        ← Back to home
      </Link>
    </main>
  )
}
