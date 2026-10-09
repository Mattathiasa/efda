'use client';

import {useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {GlobeMark} from './GlobeMark';
import {ArrowRight} from './icons';
import {TOPICS, type Topic} from '@/lib/contact-shared';
import {site} from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error';

/* Topic chips, five fields, send, thank-you state. The design's version sent
   nothing; this one POSTs to /api/contact and only shows the thank-you on a
   2xx. On failure it keeps everything the visitor typed and offers the phone
   number instead. */
export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [topic, setTopic] = useState<Topic>('partner');
  const [state, setState] = useState<State>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setState('sending');
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, topic, locale})
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('sent');
      // Move focus so the change is announced.
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setState('error');
    }
  }

  function reset() {
    formRef.current?.reset();
    setTopic('partner');
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
          <div className="field">
            <label htmlFor="c-name">{t('fName')}</label>
            <input className="input" id="c-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="c-org">{t('fOrg')}</label>
            <input className="input" id="c-org" name="organization" type="text" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="c-email">{t('fEmail')}</label>
            <input className="input" id="c-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="c-phone">{t('fPhone')}</label>
            <input className="input" id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="+251" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="c-msg">{t('fMsg')}</label>
          <textarea className="input" id="c-msg" name="message" rows={6} required />
        </div>

        {/* Honeypot: off-screen, never filled by a person. */}
        <input
          className="hp"
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="form__foot">
          <span>
            {state === 'error' ? (
              <>
                {t('errorP')}{' '}
                <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
              </>
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
