import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {
  checkPassword,
  createSessionCookieValue,
  verifySessionCookieValue
} from './admin-auth';

describe('checkPassword', () => {
  const ORIGINAL_ENV = {...process.env};

  afterEach(() => {
    process.env = {...ORIGINAL_ENV};
  });

  it('rejects everything when ADMIN_PASSWORD is unset', () => {
    delete process.env.ADMIN_PASSWORD;
    expect(checkPassword('anything')).toBe(false);
    expect(checkPassword('')).toBe(false);
  });

  it('accepts the exact configured password', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse-battery-staple';
    expect(checkPassword('correct-horse-battery-staple')).toBe(true);
  });

  it('rejects a wrong password, including one of different length', () => {
    process.env.ADMIN_PASSWORD = 'correct-horse-battery-staple';
    expect(checkPassword('wrong')).toBe(false);
    expect(checkPassword('correct-horse-battery-staplex')).toBe(false);
  });
});

describe('createSessionCookieValue / verifySessionCookieValue', () => {
  const ORIGINAL_ENV = {...process.env};

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env = {...ORIGINAL_ENV};
  });

  it('verifies a freshly created cookie', () => {
    const now = Date.now();
    const value = createSessionCookieValue(now);
    expect(verifySessionCookieValue(value, now)).toBe(true);
  });

  it('rejects a missing or malformed value', () => {
    expect(verifySessionCookieValue(undefined)).toBe(false);
    expect(verifySessionCookieValue('')).toBe(false);
    expect(verifySessionCookieValue('no-dot-here')).toBe(false);
  });

  it('rejects an expired cookie', () => {
    const now = Date.now();
    const value = createSessionCookieValue(now);
    const farFuture = now + 60 * 60 * 24 * 1000;
    expect(verifySessionCookieValue(value, farFuture)).toBe(false);
  });

  it('rejects a tampered payload', () => {
    const now = Date.now();
    const [, sig] = createSessionCookieValue(now).split('.');
    const tampered = `${now + 1_000_000}.${sig}`;
    expect(verifySessionCookieValue(tampered, now)).toBe(false);
  });

  it('rejects a cookie signed with a different secret', () => {
    const now = Date.now();
    const value = createSessionCookieValue(now);
    process.env.ADMIN_SESSION_SECRET = 'a-different-secret';
    expect(verifySessionCookieValue(value, now)).toBe(false);
  });
});
