import type { CollectionConfig } from 'payload'

/**
 * Single-admin auth collection.
 * Hidden from the admin nav after seeding to prevent accidental changes.
 * First user is created via `bun run create-admin`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: false, // visible so admin can change password; lock down role instead
  },
  auth: {
    tokenExpiration: 60 * 60 * 2, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  access: {
    // Only an authenticated admin can read/create/update/delete users
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
}
