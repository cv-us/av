import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { VimeoEmbed } from '@/components/media/vimeo-embed'
import { ProjectGrid } from '@/components/gallery/project-grid'
import { FadeUp } from '@/components/motion/fade-up'
import { getFeaturedProjects, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { resolveMedia, mediaUrl } from '@/lib/media'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSiteSettings()
    const ogImage = mediaUrl(resolveMedia(s.ogDefaultImage), 'og')
    return buildMetadata({
      description: s.tagline,
      path: '/',
      ogImage,
      displayName: s.displayName,
    })
  } catch {
    return buildMetadata({ path: '/' })
  }
}

export default async function LandingPage() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let featured: Awaited<ReturnType<typeof getFeaturedProjects>> = []
  try {
    settings = await getSiteSettings()
    featured = await getFeaturedProjects(6)
  } catch {
    // DB not ready yet
  }

  const displayName = settings?.displayName || 'Your Name'
  const tagline = settings?.tagline || 'Character Animator · 3D Generalist'
  const reelId = settings?.reelVimeoId

  return (
    <>
      {/* Hero */}
      <section className="pt-4 pb-16 md:pt-8 md:pb-24">
        <FadeUp>
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
            Portfolio · Demo Reel
          </p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] tracking-tight text-[var(--ink)] md:text-7xl">
            {displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{tagline}</p>
        </FadeUp>

        <FadeUp delay={0.08} className="mt-10">
          {reelId ? (
            <VimeoEmbed videoId={reelId} title={`${displayName} — Demo Reel`} />
          ) : (
            <div
              className="flex w-full items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              Add your Vimeo reel ID in the CMS (Site Settings → reelVimeoId) to display your demo reel here.
            </div>
          )}
        </FadeUp>

        {settings?.reelCaption && (
          <FadeUp delay={0.12}>
            <p className="mt-4 text-sm text-[var(--muted)]">{settings.reelCaption}</p>
          </FadeUp>
        )}

        <FadeUp delay={0.16} className="mt-8 flex flex-wrap gap-6 text-sm">
          <Link
            href="/reel"
            className="inline-flex items-center gap-2 text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
          >
            Full reel + shot breakdown <ArrowRight size={14} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)]"
          >
            About
          </Link>
        </FadeUp>
      </section>

      {/* Featured */}
      <section className="py-16 md:py-24">
        <FadeUp className="mb-12 flex items-end justify-between">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Selected work
          </h2>
          <Link
            href="/animation"
            className="hidden text-sm text-[var(--muted)] hover:text-[var(--ink)] md:block"
          >
            See all projects →
          </Link>
        </FadeUp>

        {/* @ts-expect-error — Payload doc shape is loose */}
        <ProjectGrid projects={featured} variant="editorial" />
      </section>

      {/* Discipline callouts */}
      <section className="py-16 md:py-24">
        <FadeUp>
          <h2 className="font-display mb-10 text-3xl tracking-tight md:text-4xl">
            Disciplines
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: '/animation',
              title: '3D Animation',
              desc: 'Character acting, body mechanics, creature, dialogue.',
            },
            {
              href: '/modeling',
              title: '3D Modeling',
              desc: 'Characters, props, environments. Turntables + GLB.',
            },
            {
              href: '/digital',
              title: 'Digital Art',
              desc: 'Concept art, illustration, paintover studies.',
            },
            {
              href: '/drawing',
              title: 'Traditional',
              desc: 'Life drawing, figure, sketchbook fundamentals.',
            },
          ].map((d, i) => (
            <FadeUp key={d.href} delay={i * 0.05}>
              <Link
                href={d.href}
                className="group block border-t border-[var(--border)] pt-6 hover:border-[var(--accent)]"
              >
                <h3 className="font-display text-xl text-[var(--ink)] group-hover:text-[var(--accent)]">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{d.desc}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  )
}
