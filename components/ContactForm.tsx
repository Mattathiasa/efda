'use client';

import {useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {GlobeMark} from './GlobeMark';
import {ArrowRight} from './icons';
import {TOPICS, type Topic} from '@/lib/contact-shared';
import {Turnstile} from './Turnstile';
import {site} from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error' | 'invalid';

/* Builds a mailto: carrying everything the visitor already typed, so a failed
   send does not cost them the message. Subject mirrors the one the server
   would have used. */
function buildMailto(
  data: Record<string, FormDataEntryValue>,
  topic: Topic,
  topicLabel: string
) {
  const get = (k: string) => String(data[k] ?? '').trim();
  const who = get('organization') ? `${get('name')}, ${get('organization')}` : get('name');
  const body = [
    `Topic: ${topicLabel}`,
    `Name: ${get('name')}`,
    `Organization: ${get('organization') || '-'}`,
    `Email: ${get('email')}`,
    `Phone: ${get('phone') || '-'}`,
    '',
    get('message')
  ].join('\n');

  return `mailto:${site.email}?subject=${encodeURIComponent(
    `[EFDA site] ${topicLabel} — ${who}`
  )}&body=${encodeURIComponent(body)}`;
}

/* Topic chips, five fields, send, thank-you state. The design's version sent
   nothing; this one POSTs to /api/contact and only shows the thank-you on a
   2xx. On failure it keeps everything the visitor typed and offers the phone
   number instead. */
/* A labelled field that can carry a validation message. The message is tied
   to the input with aria-describedby by the caller, and the input marked
   aria-invalid, so a screen reader announces the problem rather than leaving
   it as a colour change nobody hears. */
function Field({
  id,
  label,
  error,
  children
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [topic, setTopic] = useState<Topic>('partner');
  const [state, setState] = useState<State>('idle');
  // Field names the server rejected. It already returns these; the form used
  // to throw them away and show only a generic failure.
  const [badFields, setBadFields] = useState<string[]>([]);
  const [mailtoHref, setMailtoHref] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // Field names the server uses map to one message each.
  const messages: Record<string, string> = {
    name: t('errName'),
    organization: t('errOrganization'),
    email: t('errEmail'),
    phone: t('errPhone'),
    message: t('errMessage')
  };
  const err = (field: string) =>
    badFields.includes(field) ? messages[field] : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setState('sending');
    setBadFields([]);
    const data = Object.fromEntries(new FormData(form).entries());

    // Turnstile's implicit mode injects this input into the form. Absent when
    // the widget is not configured, which the server treats as "off".
    const turnstileToken = String(data['cf-turnstile-response'] ?? '');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, topic, locale, turnstileToken})
      });
      if (!res.ok) {
        // 400 carries the fields that failed; anything else is a transport or
        // delivery problem and gets the fallback route instead.
        if (res.status === 400) {
          const body = (await res.json().catch(() => ({}))) as {fields?: string[]};
          setBadFields(body.fields ?? []);
          setState('invalid');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      setState('sent');
      // Move focus so the change is announced.
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      // The send failed - a dropped connection, or a backend that is not
      // answering. Keep everything typed and offer a route that does not need
      // our server: their own mail client, pre-filled, so nothing is retyped.
      setMailtoHref(buildMailto(data, topic, t(`topics.${topic}`)));
      setState('error');
    }
  }

  function reset() {
    formRef.current?.reset();
    setTopic('partner');
    setBadFields([]);
    setState('idle');
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLInputElement>('input:not([type="hidden"]):not([tabindex="-1"])')
        ?.focus();
    });
  }

  return (
    <>
      <form
        ref={formRef}
        className="form"
        onSubmit={onSubmit}
        method="post"
        noValidate
        hidden={state === 'sent'}
      >
        <h2>{t('formH2')}</h2>

        <div role="group" aria-label={t('topicQ')}>
          <span className="form__group-label">{t('topicQ')}</span>
          <div className="topics">
            {TOPICS.map((key) => (
              <button
                key={key}
                type="button"
                className="topic"
                aria-pressed={topic === key}
                onClick={() => setTopic(key)}
              >
                {t(`topics.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="auto-grid fields">
          <Field id="c-name" name="name" label={t('fName')} error={err('name')}>
            <input className="input" id="c-name" name="name" type="text" autoComplete="name" required
              aria-invalid={err('name') ? true : undefined}
              aria-describedby={err('name') ? 'c-name-err' : undefined} />
          </Field>
          <Field id="c-org" name="organization" label={t('fOrg')} error={err('organization')}>
            <input className="input" id="c-org" name="organization" type="text" autoComplete="organization"
              aria-invalid={err('organization') ? true : undefined}
              aria-describedby={err('organization') ? 'c-org-err' : undefined} />
          </Field>
          <Field id="c-email" name="email" label={t('fEmail')} error={err('email')}>
            <input className="input" id="c-email" name="email" type="email" autoComplete="email" required
              aria-invalid={err('email') ? true : undefined}
              aria-describedby={err('email') ? 'c-email-err' : undefined} />
          </Field>
          <Field id="c-phone" name="phone" label={t('fPhone')} error={err('phone')}>
            <input className="input" id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="+251"
              aria-invalid={err('phone') ? true : undefined}
              aria-describedby={err('phone') ? 'c-phone-err' : undefined} />
          </Field>
        </div>

        <Field id="c-msg" name="message" label={t('fMsg')} error={err('message')}>
          <textarea className="input" id="c-msg" name="message" rows={6} required
            aria-invalid={err('message') ? true : undefined}
            aria-describedby={err('message') ? 'c-msg-err' : undefined} />
        </Field>

        {/* Honeypot: off-screen, never filled by a person. */}
        <input
          className="hp"
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <Turnstile />

        <div className="form__foot">
          <span>
            {state === 'error' ? (
              <>
                {t('errorP')}{' '}
                <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
                {mailtoHref ? (
                  <>
                    {' · '}
                    <a href={mailtoHref}>{t('mailto')}</a>
                  </>
                ) : null}
              </>
            ) : state === 'invalid' ? (
              t('errFix')
            ) : (
              t('replyNote')
            )}
          </span>
          <button className="btn btn--primary" type="submit" disabled={state === 'sending'}>
            <span>{state === 'sending' ? t('sending') : t('send')}</span>
            <ArrowRight />
          </button>
        </div>
      </form>

      <div
        className="sent"
        role="status"
        tabIndex={-1}
        ref={sentRef}
        hidden={state !== 'sent'}
      >
        <GlobeMark variant="reversed" size={88} />
        <h2>{t('sentH2')}</h2>
        <p>{t('sentP')}</p>
        <button
          className="btn btn--ghost"
          type="button"
          style={{alignSelf: 'flex-start'}}
          onClick={reset}
        >
          {t('another')}
        </button>
      </div>
    </>
  );
}
