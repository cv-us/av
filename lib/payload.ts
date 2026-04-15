import 'server-only'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Payload Local API client. Cached across requests within a process.
 * Use inside React Server Components and route handlers only.
 */
export const payload = async () => getPayload({ config })
