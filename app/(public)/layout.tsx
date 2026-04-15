import { Analytics } from '@vercel/analytics/react'
import { TopNav } from '@/components/nav/top-nav'
import { Footer } from '@/components/nav/footer'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { getSiteSettings } from '@/lib/queries'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  try {
    settings = await getSiteSettings()
  } catch {
    // DB unreachable (first dev boot before seed) — render nav with defaults
    settings = null
  }

  const displayName = settings?.displayName || 'Portfolio'
  const links = {
    email: settings?.email ?? undefined,
    linkedin: settings?.linkedin ?? undefined,
    vimeo: settings?.vimeo ?? undefined,
    instagram: settings?.instagram ?? undefined,
    artstation: settings?.artstation ?? undefined,
  }

  return (
    <ThemeProvider>
      <TopNav displayName={displayName} />
      <main id="main" className="mx-auto w-full max-w-7xl px-6 pt-10 pb-16">
        {children}
      </main>
      <Footer displayName={displayName} links={links} />
      <Analytics />
    </ThemeProvider>
  )
}
