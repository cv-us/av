import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { SiteSettings } from './globals/SiteSettings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Portfolio Admin',
    },
  },
  collections: [Users, Media, Categories, Projects],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-please-change',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'].filter(Boolean),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'uploads',
          generateFileURL: ({ filename, prefix }) => {
            const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || ''
            return [base, prefix, filename].filter(Boolean).join('/')
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ACCOUNT_ID
          ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
          : undefined,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        forcePathStyle: true,
      },
    }),
  ],
})
