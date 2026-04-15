import type { GlobalConfig } from 'payload'

/**
 * Site-wide singleton — edited once at setup, then tweaked as she grows.
 * Read by the landing page, /about, and the header/footer.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'displayName', type: 'text', required: true, defaultValue: 'Your Name' },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Character Animator · 3D Generalist',
      admin: { description: 'Primary specialization + secondary range. Shown on landing hero.' },
    },

    // About page
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description:
          'Your full about-page bio. Include a short, dignified personal paragraph if you like (see the plan).',
      },
    },
    { name: 'headshot', type: 'upload', relationTo: 'media' },

    // Résumé
    {
      name: 'resumePdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'PDF résumé — powers the Download button on /about.' },
    },

    // Demo reel
    {
      name: 'reelVimeoId',
      type: 'text',
      admin: {
        description:
          'Vimeo video ID for the hero demo reel (e.g. 123456789). Vimeo is the industry standard.',
      },
    },
    {
      name: 'reelCaption',
      type: 'text',
      admin: { description: 'Short descriptor shown beneath the hero reel.' },
    },

    // Contact
    { name: 'email', type: 'email' },
    { name: 'linkedin', type: 'text' },
    { name: 'vimeo', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'artstation', type: 'text' },

    // SEO
    {
      name: 'ogDefaultImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Fallback OpenGraph share image for the landing page.' },
    },

    // Education
    {
      name: 'education',
      type: 'array',
      fields: [
        { name: 'institution', type: 'text', required: true },
        { name: 'degree', type: 'text' },
        { name: 'years', type: 'text' },
        { name: 'notes', type: 'text' },
      ],
    },
  ],
}
