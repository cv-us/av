import type { Metadata } from 'next'
import { FadeUp } from '@/components/motion/fade-up'
import { ContactForm } from './contact-form'
import { getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  let name = 'Portfolio'
  try {
    name = (await getSiteSettings()).displayName || name
  } catch {}
  return buildMetadata({
    title: 'Contact',
    description: 'Get in touch about roles, freelance, or collaboration.',
    path: '/contact',
    displayName: name,
  })
}

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <FadeUp>
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
          Contact
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="measure mt-4 text-base text-[var(--muted)]">
          Open to roles in character animation and 3D generalist work. For
          studio applications, please also include the job requisition number.
        </p>
      </FadeUp>

      <FadeUp delay={0.05} className="mt-10">
        <ContactForm />
      </FadeUp>

      {(settings?.email || settings?.linkedin) && (
        <FadeUp delay={0.1} className="mt-10 flex flex-wrap gap-6 text-sm text-[var(--muted)]">
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="hover:text-[var(--ink)]"
            >
              {settings.email}
            </a>
          )}
          {settings?.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-[var(--ink)]"
            >
              LinkedIn
            </a>
          )}
        </FadeUp>
      )}
    </div>
  )
}
