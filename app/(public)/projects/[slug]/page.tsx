import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAllProjectSlugs, getProjectBySlug, getSiteSettings } from '@/lib/queries'
import { buildMetadata, creativeWorkSchema, SITE_URL } from '@/lib/seo'
import { resolveMedia, mediaUrl, type MediaDoc } from '@/lib/media'
import { richTextToPlain } from '@/lib/utils'
import { RichText } from '@/components/rich-text'
import { FadeUp } from '@/components/motion/fade-up'
import { MediaGallery } from '@/components/lightbox/media-gallery'
import { R2Image } from '@/components/media/r2-image'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const slugs = await getAllProjectSlugs()
    return slugs.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  try {
    const project = await getProjectBySlug(slug)
    if (!project) return buildMetadata({ title: 'Not Found', path: '/' })
    const settings = await getSiteSettings()
    const cover = resolveMedia(project.coverMedia)
    return buildMetadata({
      title: project.seoTitle || project.title,
      description:
        project.seoDescription ||
        richTextToPlain(project.description) ||
        project.subtitle,
      path: `/projects/${project.slug}`,
      ogImage: `${SITE_URL}/og/${project.slug}`,
      displayName: settings.displayName,
    })
  } catch {
    return buildMetadata({ title: 'Project', path: '/' })
  }
}

export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  if (!project) notFound()

  const settings = await getSiteSettings().catch(() => null)
  const cover = resolveMedia(project.coverMedia)
  const mediaItems: MediaDoc[] = Array.isArray(project.media)
    ? (project.media
        .map((m: any) => resolveMedia(m?.item))
        .filter(Boolean) as MediaDoc[])
    : []

  // Prepend cover to gallery if it isn't already in the list
  const allMedia: MediaDoc[] = cover
    ? [cover, ...mediaItems.filter((m) => m.id !== cover.id)]
    : mediaItems

  const jsonLd = creativeWorkSchema({
    name: project.title,
    description:
      richTextToPlain(project.description) || project.subtitle || undefined,
    creator: settings?.displayName || 'Artist',
    url: `${SITE_URL}/projects/${project.slug}`,
    image: mediaUrl(cover, 'og') || mediaUrl(cover),
    dateCreated: project.year ?? undefined,
  })

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FadeUp>
        <Link
          href={
            project.category && typeof project.category === 'object'
              ? `/${(project.category as { slug?: string }).slug || ''}`
              : '/'
          }
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </FadeUp>

      <header className="mt-6 grid grid-cols-1 gap-10 pb-10 md:grid-cols-12">
        <FadeUp className="md:col-span-8">
          <h1 className="font-display text-4xl tracking-tight md:text-6xl">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="mt-3 text-lg text-[var(--muted)]">
              {project.subtitle}
            </p>
          )}
        </FadeUp>
        <FadeUp className="md:col-span-4">
          <dl className="space-y-3 text-sm">
            {project.role && (
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Role
                </dt>
                <dd>{project.role}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Year
                </dt>
                <dd>{project.year}</dd>
              </div>
            )}
            {Array.isArray(project.tools) && project.tools.length > 0 && (
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Tools
                </dt>
                <dd>
                  {(project.tools as Array<{ name?: string }>)
                    .map((t) => t.name)
                    .filter(Boolean)
                    .join(' · ')}
                </dd>
              </div>
            )}
            {project.breakdownUrl && (
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Breakdown
                </dt>
                <dd>
                  <a
                    href={project.breakdownUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-4 decoration-[var(--accent)]"
                  >
                    Watch shot breakdown
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </FadeUp>
      </header>

      {/* Cover hero */}
      {cover && (
        <FadeUp>
          <div className="overflow-hidden bg-[var(--surface)]">
            <R2Image media={cover} size="light" priority />
          </div>
        </FadeUp>
      )}

      {/* Description */}
      {project.description && (
        <FadeUp className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="font-display text-2xl tracking-tight">About this work</h2>
          </div>
          <div className="md:col-span-8">
            <RichText data={project.description} />
          </div>
        </FadeUp>
      )}

      {/* Gallery */}
      {allMedia.length > 1 && (
        <section className="mt-20">
          <FadeUp className="mb-8">
            <h2 className="font-display text-2xl tracking-tight">Gallery</h2>
          </FadeUp>
          <MediaGallery items={allMedia} />
        </section>
      )}

      {/* Credits */}
      {project.credits && (
        <section className="mt-20 border-t border-[var(--border)] pt-10">
          <FadeUp className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-2xl tracking-tight">Credits</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Work and assets credited to their creators.
              </p>
            </div>
            <div className="md:col-span-8 text-sm text-[var(--muted)]">
              <RichText data={project.credits} />
            </div>
          </FadeUp>
        </section>
      )}
    </article>
  )
}
