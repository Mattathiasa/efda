import {describe, expect, it} from 'vitest';
import {checkRateLimit} from './rate-limit';

describe('checkRateLimit', () => {
  it('allows the first 5 requests in a window and limits the 6th', () => {
    const key = `test-${Math.random()}`;
    const now = Date.now();

    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, now).limited).toBe(false);
    }
    const sixth = checkRateLimit(key, now);
    expect(sixth.limited).toBe(true);
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('tracks separate keys independently', () => {
    const now = Date.now();
    const a = `test-a-${Math.random()}`;
    const b = `test-b-${Math.random()}`;

    for (let i = 0; i < 5; i++) checkRateLimit(a, now);
    expect(checkRateLimit(a, now).limited).toBe(true);
    expect(checkRateLimit(b, now).limited).toBe(false);
  });

  it('resets once the window has passed', () => {
    const key = `test-reset-${Math.random()}`;
    const now = Date.now();

    for (let i = 0; i < 5; i++) checkRateLimit(key, now);
    expect(checkRateLimit(key, now).limited).toBe(true);

    expect(checkRateLimit(key, now + 61_000).limited).toBe(false);
  });
});
