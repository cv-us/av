import type { Metadata } from 'next'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { FadeUp } from '@/components/motion/fade-up'
import { R2Image } from '@/components/media/r2-image'
import { RichText } from '@/components/rich-text'
import { getSiteSettings } from '@/lib/queries'
import { buildMetadata, personSchema, SITE_URL } from '@/lib/seo'
import { resolveMedia, mediaUrl } from '@/lib/media'
import { richTextToPlain } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSiteSettings()
    return buildMetadata({
      title: 'About',
      description: richTextToPlain(s.bio) || s.tagline,
      path: '/about',
      displayName: s.displayName,
    })
  } catch {
    return buildMetadata({ title: 'About', path: '/about' })
  }
}

// Default bio paragraph used when the CMS bio is empty — the
// "subtle personal thread" approved in planning. Editable in /admin.
const DEFAULT_BIO_PARAS = [
  "I'm a 3D animator working in character acting, body mechanics, and narrative shots. I believe the difference between a technically correct performance and a memorable one lives in the seconds nobody asks you to animate — the breath before a line, the weight of a decision, the small recoveries that make a character feel alive.",
  "My father came from Guatemala and built a life in California through sheer work. He raised me through the hardest years of our family. The storytelling instinct I bring to animation — the belief that ordinary people carry extraordinary weight — started at our kitchen table, in two languages.",
  "Citrus College taught me to draw from life. CSU Northridge taught me to move it.",
]

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null)
  const headshot = resolveMedia(settings?.headshot)
  const resume = resolveMedia(settings?.resumePdf)
  const education = (settings?.education || []) as Array<{
    institution?: string
    degree?: string
    years?: string
    notes?: string
  }>

  const jsonLd = personSchema({
    name: settings?.displayName || 'Artist',
    url: `${SITE_URL}/about`,
    jobTitle: settings?.tagline,
    alumniOf: education.map((e) => e.institution || '').filter(Boolean),
    sameAs: [
      settings?.linkedin,
      settings?.vimeo,
      settings?.instagram,
      settings?.artstation,
    ].filter(Boolean) as string[],
  })

  return (
    <div className="pt-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FadeUp>
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
          About
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
          {settings?.displayName || 'About'}
        </h1>
        {settings?.tagline && (
          <p className="mt-3 text-lg text-[var(--muted)]">{settings.tagline}</p>
        )}
      </FadeUp>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12">
        <FadeUp className="md:col-span-4">
          {headshot ? (
            <div className="overflow-hidden">
              <R2Image media={headshot} size="card" />
            </div>
          ) : (
            <div
              className="bg-[var(--surface)]"
              style={{ aspectRatio: '4 / 5' }}
            />
          )}

          {resume && (
            <a
              href={mediaUrl(resume)}
              download
              className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              <Download size={16} />
              Download résumé (PDF)
            </a>
          )}
        </FadeUp>

        <FadeUp delay={0.05} className="md:col-span-8">
          {settings?.bio ? (
            <RichText data={settings.bio} />
          ) : (
            <div className="measure space-y-4 text-[var(--ink)]">
              {DEFAULT_BIO_PARAS.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-2xl tracking-tight">Education</h2>
              <ul className="mt-5 divide-y divide-[var(--border)]">
                {education.map((e, i) => (
                  <li key={i} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <p className="font-display text-lg">{e.institution}</p>
                      {e.years && (
                        <span className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                          {e.years}
                        </span>
                      )}
                    </div>
                    {e.degree && (
                      <p className="text-sm text-[var(--ink)]">{e.degree}</p>
                    )}
                    {e.notes && (
                      <p className="mt-1 text-sm text-[var(--muted)]">{e.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-14">
            <h2 className="font-display text-2xl tracking-tight">Get in touch</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Open to roles in character animation and 3D generalist work.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--ink)] underline underline-offset-4 decoration-[var(--accent)]"
            >
              Contact →
            </Link>
          </section>
        </FadeUp>
      </div>
    </div>
  )
}
