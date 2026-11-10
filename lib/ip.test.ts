import {afterEach, describe, expect, it} from 'vitest';
import {hashIp} from './ip';

describe('hashIp', () => {
  const ORIGINAL_ENV = {...process.env};

  afterEach(() => {
    process.env = {...ORIGINAL_ENV};
  });

  it('returns null for a missing IP', () => {
    expect(hashIp(undefined)).toBeNull();
    expect(hashIp(null)).toBeNull();
    expect(hashIp('')).toBeNull();
  });

  it('is deterministic for the same IP and salt', () => {
    process.env.IP_HASH_SALT = 'salt';
    expect(hashIp('203.0.113.1')).toBe(hashIp('203.0.113.1'));
  });

  it('differs between IPs', () => {
    process.env.IP_HASH_SALT = 'salt';
    expect(hashIp('203.0.113.1')).not.toBe(hashIp('203.0.113.2'));
  });

  it('differs between salts for the same IP', () => {
    process.env.IP_HASH_SALT = 'salt-a';
    const a = hashIp('203.0.113.1');
    process.env.IP_HASH_SALT = 'salt-b';
    const b = hashIp('203.0.113.1');
    expect(a).not.toBe(b);
  });

  it('works with no salt configured', () => {
    delete process.env.IP_HASH_SALT;
    expect(hashIp('203.0.113.1')).toMatch(/^[0-9a-f]{64}$/);
  });
});
