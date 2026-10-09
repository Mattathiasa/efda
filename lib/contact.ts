/* Validation and dispatch for the contact form.

   The design's form was a front-end demo. This is the real path: the browser
   POSTs to /api/contact and only sees the "sent" state on a 2xx response.

   Writing happens server-side, so there is no Firebase client SDK in the
   bundle, no Firestore security rules to get wrong, and no App Check. */

import {TOPICS, type Topic} from './contact-shared';

export {TOPICS};
export type {Topic};

export interface ContactMessage {
  topic: Topic;
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
}

export type ValidationResult =
  | {ok: true; data: ContactMessage}
  | {ok: false; errors: string[]};

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Field rules from the build document, enforced server-side. */
export function validate(input: unknown, locales: readonly string[]): ValidationResult {
  const errors: string[] = [];
  const body = (input ?? {}) as Record<string, unknown>;

  const topicRaw = str(body.topic);
  const topic = (TOPICS as readonly string[]).includes(topicRaw)
    ? (topicRaw as Topic)
    : 'partner';

  const name = str(body.name);
  if (name.length < 2 || name.length > 120) errors.push('name');

  const organization = str(body.organization);
  if (organization.length > 160) errors.push('organization');

  const email = str(body.email);
  // Deliberately permissive: one @, no spaces, a dot in the domain.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.push('email');

  const phone = str(body.phone);
  if (phone.length > 40) errors.push('phone');

  const message = str(body.message);
  if (message.length < 10 || message.length > 4000) errors.push('message');

  const localeRaw = str(body.locale);
  const locale = locales.includes(localeRaw) ? localeRaw : 'en';

  if (errors.length) return {ok: false, errors};
  return {ok: true, data: {topic, name, organization, email, phone, message, locale}};
}

/** Subject line EFDA sees in the inbox. */
export function subjectFor(m: ContactMessage, topicLabel: string) {
  const who = m.organization ? `${m.name}, ${m.organization}` : m.name;
  return `[EFDA site] ${topicLabel} — ${who}`;
}

/* Cloudflare Turnstile. Skipped when no secret is configured, so the form
   works locally and in review before EFDA has keys. */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({secret, response: token});
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body
    });
    const json = (await res.json()) as {success?: boolean};
    return json.success === true;
  } catch {
    return false;
  }
}

export type DispatchResult = {delivered: boolean; via: string};

/* Where the message goes. The adapter is chosen by which environment
   variables are set, so the site can launch on either backend - or neither,
   while the domain and inbox are still being sorted out. */
export async function dispatch(
  m: ContactMessage,
  subject: string
): Promise<DispatchResult> {
  const formspree = process.env.FORMSPREE_ENDPOINT;
  const firebaseProject = process.env.FIREBASE_PROJECT_ID;

  if (firebaseProject) {
    // Firestore + the Trigger Email extension. Imported lazily so the
    // dependency is only needed when it is actually configured.
    const {writeToFirestore} = await import('./firestore');
    await writeToFirestore(m, subject);
    return {delivered: true, via: 'firestore'};
  }

  if (formspree) {
    const res = await fetch(formspree, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({...m, _subject: subject})
    });
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    return {delivered: true, via: 'formspree'};
  }

  // Nothing configured yet. Log it so the form is testable end to end, and
  // say so plainly rather than pretending it was delivered.
  console.warn(
    '[contact] No delivery backend configured (set FIREBASE_PROJECT_ID or ' +
      'FORMSPREE_ENDPOINT). Message was logged, not sent:',
    {subject, from: m.email, locale: m.locale}
  );
  return {delivered: false, via: 'log'};
}
