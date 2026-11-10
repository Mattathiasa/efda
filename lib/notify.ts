/* Resend adapter for the "new message" notification email.

   Deliberately separate from delivery: lib/messages.ts's insertMessage() is
   the record of truth (see scripts/db-init.mjs), and a failed email must
   never mean a lost enquiry. Callers are expected to catch, not propagate,
   whatever this throws. */

export interface NotifyResult {
  sent: boolean;
}

export async function sendNotification(
  subject: string,
  text: string,
  replyTo: string
): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!apiKey || !to) return {sent: false};

  // Resend's shared onboarding address only delivers to the account owner
  // until a sending domain is verified - fine for getting this wired up,
  // not for production traffic.
  const from = process.env.RESEND_FROM ?? 'EFDA Site <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({from, to, reply_to: replyTo, subject, text})
  });

  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return {sent: true};
}
