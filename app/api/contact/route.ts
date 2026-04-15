import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

export const runtime = 'nodejs'

const Payload = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot — must be empty
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = Payload.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  // Silent success for honeypot hits
  if (parsed.data.website) {
    return NextResponse.json({ ok: true })
  }

  const to = process.env.CONTACT_TO_EMAIL
  const apiKey = process.env.RESEND_API_KEY

  if (!to || !apiKey) {
    console.error('[contact] missing RESEND_API_KEY or CONTACT_TO_EMAIL')
    return NextResponse.json(
      { error: 'Contact form not yet configured. Please email directly.' },
      { status: 503 },
    )
  }

  const resend = new Resend(apiKey)
  const { name, email, subject, message } = parsed.data

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: [to],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed', err)
    return NextResponse.json(
      { error: 'Could not send message. Please try again.' },
      { status: 502 },
    )
  }
}
