import type { Metadata } from 'next'
import Link from 'next/link'
import { VimeoEmbed } from '@/components/media/vimeo-embed'
import { FadeUp } from '@/components/motion/fade-up'
import { getProjects, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { resolveMedia, mediaUrl } from '@/lib/media'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSiteSettings()
    return buildMetadata({
      title: 'Demo Reel',
      description: `${s.displayName} — ${s.tagline}. Full demo reel and shot breakdown.`,
      path: '/reel',
      ogImage: mediaUrl(resolveMedia(s.ogDefaultImage), 'og'),
      displayName: s.displayName,
    })
  } catch {
    return buildMetadata({ title: 'Demo Reel', path: '/reel' })
  }
}

export default async function ReelPage() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    settings = await getSiteSettings()
    projects = await getProjects('animation')
  } catch {
    // DB not ready
  }

  return (
    <div className="pt-8 pb-24">
      <FadeUp>
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
          Demo Reel
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
          {settings?.displayName || 'Demo Reel'}
        </h1>
        {settings?.tagline && (
          <p className="mt-3 text-lg text-[var(--muted)]">{settings.tagline}</p>
        )}
      </FadeUp>

      <FadeUp delay={0.1} className="mt-10">
        {settings?.reelVimeoId ? (
          <VimeoEmbed videoId={settings.reelVimeoId} />
        ) : (
          <div
            className="flex w-full items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted)]"
            style={{ aspectRatio: '16 / 9' }}
          >
            Add your Vimeo reel ID in Site Settings.
          </div>
        )}
      </FadeUp>

      {/* Shot breakdown — per-shot credits and caveats */}
      <section className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-12">
        <FadeUp className="md:col-span-4">
          <h2 className="font-display text-2xl tracking-tight">
            Shot breakdown
          </h2>
          <p className="measure mt-3 text-sm text-[var(--muted)]">
            Each shot below lists my role, the software used, and credits
            where the rig, model, or reference was not mine. Studios value
            this honesty — it protects everyone involved.
          </p>
        </FadeUp>
        <div className="md:col-span-8">
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Shot breakdown content will appear here once animation
              projects are published in the CMS.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {projects.map((p) => (
                <li key={p.id} className="py-5">
                  <FadeUp>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
                    >
                      <div>
                        <h3 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--accent)]">
                          {p.title}
                        </h3>
                        {p.subtitle && (
                          <p className="text-sm text-[var(--muted)]">
                            {p.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                        {p.role}
                        {p.year && <span className="mx-2">·</span>}
                        {p.year}
                      </div>
                    </Link>
                  </FadeUp>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
