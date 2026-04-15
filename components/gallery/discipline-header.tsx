import { FadeUp } from '@/components/motion/fade-up'

export function DisciplineHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <section className="pt-4 pb-16">
      <FadeUp>
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="measure mt-4 text-base text-[var(--muted)]">{intro}</p>
        )}
      </FadeUp>
    </section>
  )
}
