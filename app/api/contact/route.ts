import {NextResponse} from 'next/server';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {validate, verifyTurnstile, subjectFor, dispatch} from '@/lib/contact';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: 'invalid-json'}, {status: 400});
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  // Honeypot. The design already ships this field, hidden off-screen; a real
  // person never fills it. Answer 200 so bots learn nothing.
  if (typeof payload.company_website === 'string' && payload.company_website.trim()) {
    return NextResponse.json({ok: true}, {status: 200});
  }

  const result = validate(payload, routing.locales);
  if (!result.ok) {
    return NextResponse.json({error: 'invalid', fields: result.errors}, {status: 400});
  }

  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    undefined;

  const passed = await verifyTurnstile(String(payload.turnstileToken ?? ''), ip);
  if (!passed) {
    return NextResponse.json({error: 'challenge-failed'}, {status: 403});
  }

  // Localised topic label, so the subject line reads in the sender's language.
  const t = await getTranslations({
    locale: result.data.locale,
    namespace: 'contact.topics'
  });
  const subject = subjectFor(result.data, t(result.data.topic));

  try {
    const {delivered, via} = await dispatch(result.data, subject);

    // Never tell a visitor their message is on its way when it is not. If a
    // production deploy has no delivery backend configured, fail loudly so
    // the form shows its error state and offers the phone number instead of
    // silently swallowing an enquiry.
    if (!delivered && process.env.NODE_ENV === 'production') {
      return NextResponse.json({error: 'not-configured'}, {status: 503});
    }

    return NextResponse.json({ok: true, delivered, via});
  } catch (error) {
    console.error('[contact] delivery failed:', error);
    return NextResponse.json({error: 'delivery-failed'}, {status: 502});
  }
}
