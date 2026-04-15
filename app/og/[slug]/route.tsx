import { ImageResponse } from 'next/og'
import { getProjectBySlug, getSiteSettings } from '@/lib/queries'
import { resolveMedia, mediaUrl } from '@/lib/media'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  const settings = await getSiteSettings().catch(() => null)
  const name = settings?.displayName || 'Portfolio'

  const cover = project ? resolveMedia(project.coverMedia) : null
  const coverUrl = cover ? mediaUrl(cover, 'og') || mediaUrl(cover) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0E0D0C',
          color: '#EDE8E0',
          position: 'relative',
        }}
      >
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={coverUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(14,13,12,0.3) 0%, rgba(14,13,12,0.85) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '60px',
            width: '100%',
            height: '100%',
          }}
        >
          <p
            style={{
              fontSize: 22,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#D97F4E',
              margin: 0,
            }}
          >
            {name}
          </p>
          <h1
            style={{
              fontSize: project?.title && project.title.length > 30 ? 68 : 84,
              lineHeight: 1.05,
              margin: '16px 0 0 0',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              maxWidth: '85%',
            }}
          >
            {project?.title || settings?.tagline || 'Portfolio'}
          </h1>
          {project?.subtitle && (
            <p
              style={{
                fontSize: 28,
                color: '#8A847B',
                margin: '16px 0 0 0',
                maxWidth: '75%',
              }}
            >
              {project.subtitle}
            </p>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
