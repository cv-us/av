/**
 * One-time admin creation. Reads ADMIN_EMAIL and ADMIN_PASSWORD from env.
 *
 * Run: bun run create-admin
 */
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local and retry.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log(`User already exists: ${email}`)
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: { email, password },
  })

  console.log(`+ Admin created: ${email}`)
  console.log('Sign in at /admin')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
