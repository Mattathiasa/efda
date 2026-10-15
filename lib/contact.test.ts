import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {dispatch, subjectFor, turnstileStatus, validate, verifyTurnstile} from './contact';

const LOCALES = ['en', 'am', 'om'] as const;

const validInput = {
  topic: 'partner',
  name: 'Guta Abdi',
  organization: 'EFDA',
  email: 'guta@example.com',
  phone: '+251911218169',
  message: 'We would like to discuss a potential partnership.',
  locale: 'en'
};

describe('validate', () => {
  it('accepts a fully valid submission', () => {
    const result = validate(validInput, LOCALES);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe('Guta Abdi');
      expect(result.data.topic).toBe('partner');
    }
  });

  it('falls back to the "partner" topic when given an unknown one', () => {
    const result = validate({...validInput, topic: 'not-a-real-topic'}, LOCALES);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.topic).toBe('partner');
  });

  it('falls back to "en" when given a locale outside the site', () => {
    const result = validate({...validInput, locale: 'fr'}, LOCALES);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.locale).toBe('en');
  });

  it('rejects a name that is too short', () => {
    const result = validate({...validInput, name: 'A'}, LOCALES);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContain('name');
  });

  it('rejects an organization name over 160 characters', () => {
    const result = validate({...validInput, organization: 'x'.repeat(161)}, LOCALES);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContain('organization');
  });

  it('rejects an email without an @ or a domain dot', () => {
    for (const email of ['not-an-email', 'missing-domain@', 'two@at@signs.com']) {
      const result = validate({...validInput, email}, LOCALES);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors).toContain('email');
    }
  });

  it('rejects a message under 10 characters', () => {
    const result = validate({...validInput, message: 'too short'}, LOCALES);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContain('message');
  });

  it('rejects a message over 4000 characters', () => {
    const result = validate({...validInput, message: 'x'.repeat(4001)}, LOCALES);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContain('message');
  });

  it('treats a missing body as all fields empty rather than throwing', () => {
    const result = validate(undefined, LOCALES);
    expect(result.ok).toBe(false);
  });
});

describe('subjectFor', () => {
  it('includes the organization when present', () => {
    const subject = subjectFor({...validInput} as never, 'Partnership');
    expect(subject).toBe('[EFDA site] Partnership — Guta Abdi, EFDA');
  });

  it('omits the organization when absent', () => {
    const subject = subjectFor({...validInput, organization: ''} as never, 'Partnership');
    expect(subject).toBe('[EFDA site] Partnership — Guta Abdi');
  });
});

describe('turnstileStatus / verifyTurnstile', () => {
  const ORIGINAL_ENV = {...process.env};

  beforeEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  });

  afterEach(() => {
    process.env = {...ORIGINAL_ENV};
    vi.unstubAllGlobals();
  });

  it('is "off" when neither key is set, and verification passes without a token', async () => {
    expect(turnstileStatus()).toBe('off');
    await expect(verifyTurnstile('')).resolves.toBe(true);
  });

  it('is "misconfigured" when only one key is set, and still passes (fails open)', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(turnstileStatus()).toBe('misconfigured');
    await expect(verifyTurnstile('')).resolves.toBe(true);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('is "on" when both keys are set, and rejects a missing token', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site-key';
    expect(turnstileStatus()).toBe('on');
    await expect(verifyTurnstile('')).resolves.toBe(false);
  });

  it('accepts a token Cloudflare confirms, and rejects one it does not', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site-key';

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({json: async () => ({success: true})})
      .mockResolvedValueOnce({json: async () => ({success: false})});
    vi.stubGlobal('fetch', fetchMock);

    await expect(verifyTurnstile('good-token')).resolves.toBe(true);
    await expect(verifyTurnstile('bad-token')).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fails closed when the Cloudflare request itself errors', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site-key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down'))
    );

    await expect(verifyTurnstile('some-token')).resolves.toBe(false);
  });
});

describe('dispatch', () => {
  const ORIGINAL_ENV = {...process.env};

  beforeEach(() => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FORMSPREE_ENDPOINT;
  });

  afterEach(() => {
    process.env = {...ORIGINAL_ENV};
  });

  it('logs and reports un-delivered when no backend is configured', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await dispatch(validInput as never, 'subject');
    expect(result).toEqual({delivered: false, via: 'log'});
    expect(warnSpy).toHaveBeenCalled();
  });
});
