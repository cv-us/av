import type { CollectionConfig } from 'payload'

/**
 * Projects — a single project can contain many media items (images, videos,
 * GLB models) and is assigned to one discipline category.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'featured', 'status', 'sortOrder'],
  },
  access: {
    read: ({ req }) => {
      // Public sees only published; admin sees all
      if (req.user) return true
      return {
        status: { equals: 'published' },
      }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug. Auto-derived from title on save if left blank.',
      },
    },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'richText' },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'coverMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Used for grid cards and the OpenGraph share image.' },
    },
    {
      name: 'media',
      type: 'array',
      label: 'Gallery media (drag to reorder)',
      fields: [
        {
          name: 'item',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'Your role — e.g. "Character Animator", "Modeler + Texture".' },
    },
    {
      name: 'tools',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
      admin: { description: 'Software used — Maya, ZBrush, Substance, Houdini, etc.' },
    },
    { name: 'year', type: 'number' },
    {
      name: 'credits',
      type: 'richText',
      admin: {
        description:
          'Credit non-self-made assets (rigs, models, references). Studios look for this honesty.',
      },
    },
    {
      name: 'breakdownUrl',
      type: 'text',
      admin: { description: 'Optional Vimeo/Mux URL for shot breakdown video.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on the landing page hero grid.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower = earlier in gallery.' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: { position: 'sidebar', description: 'Optional SEO title override.' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Optional meta description (max ~160 chars).' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not provided.
        if (data && !data.slug && data.title) {
          data.slug = String(data.title)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 96)
        }
        return data
      },
    ],
  },
}
