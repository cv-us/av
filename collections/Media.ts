import type { CollectionConfig } from 'payload'

/**
 * Media collection — routes all uploads to Cloudflare R2 via the
 * s3-compatible storage adapter (configured in payload.config.ts).
 *
 * Images: sharp generates sized variants at upload time.
 * Videos: MP4 uploaded direct; for adaptive streaming, set muxPlaybackId.
 * GLBs:   served directly from R2 (unlimited free egress).
 *
 * `alt` is REQUIRED in schema — accessibility non-negotiable.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
  },
  access: {
    read: () => true, // public — media urls are already public on R2
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/*',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream', // many browsers send GLB as this
      'application/pdf',
    ],
    imageSizes: [
      { name: 'thumb', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 1200, height: undefined, position: 'centre' },
      { name: 'light', width: 2400, height: undefined, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Required. Describe the image for screen readers and SEO.',
      },
      validate: (val: unknown) => {
        if (typeof val !== 'string' || val.trim().length < 3) {
          return 'Alt text is required (at least 3 characters).'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'mediaKind',
      type: 'select',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: '3D Model (GLB/GLTF)', value: 'glb' },
        { label: 'PDF', value: 'pdf' },
      ],
      admin: {
        description: 'Auto-detected from upload; override only if needed.',
      },
    },
    {
      name: 'muxPlaybackId',
      type: 'text',
      admin: {
        description:
          'Optional. If set, the site will stream adaptive HLS via Mux instead of the raw MP4.',
        condition: (data) => data?.mediaKind === 'video',
      },
    },
    {
      name: 'lqip',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated base64 blur placeholder for progressive loading.',
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-detect mediaKind from mimeType if not already set.
        const mime: string | undefined = data?.mimeType
        if (!data?.mediaKind && mime) {
          if (mime.startsWith('image/')) data.mediaKind = 'image'
          else if (mime.startsWith('video/')) data.mediaKind = 'video'
          else if (mime.includes('gltf') || mime.includes('octet-stream'))
            data.mediaKind = 'glb'
          else if (mime === 'application/pdf') data.mediaKind = 'pdf'
        }
        return data
      },
    ],
  },
}
