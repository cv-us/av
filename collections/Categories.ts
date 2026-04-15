import type { CollectionConfig } from 'payload'

/**
 * Categories — five hard-coded discipline slugs matching the hard-coded routes
 * in app/(public)/{animation,modeling,digital,drawing,reel}.
 * Seeded via scripts/seed.ts.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder', 'visible'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug — matches /app/(public)/{slug} route.' },
    },
    { name: 'description', type: 'richText' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'visible', type: 'checkbox', defaultValue: true },
  ],
}
