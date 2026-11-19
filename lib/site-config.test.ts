import {describe, expect, it} from 'vitest';
import {
  applyReplyDays,
  defaultSiteConfig,
  mergeSiteConfig,
  SETTING_FIELDS,
  SETTING_KEYS
} from './site-config-shared';

/* Imports site-config-shared, never site-config: the latter is marked
   `server-only` and would fail to load here. Keeping the merge pure is what
   makes it testable without a database or a Next request context. */

describe('mergeSiteConfig', () => {
  it('returns the build-time defaults when nothing is stored', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {});
    expect(config.phone.display).toBe(defaultSiteConfig.phone.display);
    expect(config.email).toBe(defaultSiteConfig.email);
    expect(config.street).toBe(defaultSiteConfig.street);
    expect(config.replyDays).toBeNull();
  });

  it('falls back to EFDA’s own details, not a placeholder', () => {
    // No NEXT_PUBLIC_* vars are set in the test environment, so this is the
    // bare source default. It used to be a visible [BRACKET]; now that EFDA
    // has supplied organisational contact details it is the real thing, and
    // an unconfigured deployment shows something that works.
    const config = mergeSiteConfig(defaultSiteConfig, {});
    expect(config.email).not.toContain('CONFIRM');
    expect(config.email).toContain('@');
    expect(config.phone.tel).toMatch(/^\+251\d+$/);
    expect(config.street).toContain('Gullele');
  });

  it('gives every contact a reachable phone and mailbox', () => {
    // The three people EFDA lists have no published role addresses, so each
    // row falls through to the organisation's own channel rather than
    // rendering a bracket or exposing a personal mobile.
    const config = mergeSiteConfig(defaultSiteConfig, {});
    expect(config.contacts).toHaveLength(3);
    for (const contact of config.contacts) {
      expect(contact.name).not.toContain('CONFIRM');
      expect(contact.email).toBe(config.email);
      expect(contact.phone.tel).toBe(config.phone.tel);
    }
  });

  it('lets a stored value win over the default', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'site.email': 'info@example.org',
      'site.phone.display': '+251 911 218 169'
    });
    expect(config.email).toBe('info@example.org');
    expect(config.phone.display).toBe('+251 911 218 169');
  });

  it('treats a blank stored value as unset, restoring the placeholder', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'site.email': '   ',
      'site.phone.display': ''
    });
    expect(config.email).toBe(defaultSiteConfig.email);
    expect(config.phone.display).toBe(defaultSiteConfig.phone.display);
  });

  it('trims surrounding whitespace from stored values', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'site.email': '  info@example.org  '
    });
    expect(config.email).toBe('info@example.org');
  });

  it('always returns exactly three positionally aligned contacts', () => {
    // The locale files supply each person's department by index, so a missing
    // row must not shift the others up.
    const config = mergeSiteConfig(defaultSiteConfig, {
      'contact.1.name': 'Dechassa Sisay'
    });
    expect(config.contacts).toHaveLength(3);
    expect(config.contacts[1].name).toBe('Dechassa Sisay');
    expect(config.contacts[0].name).toBe(defaultSiteConfig.contacts[0].name);
    expect(config.contacts[2].name).toBe(defaultSiteConfig.contacts[2].name);
  });

  it('merges a contact field-by-field rather than whole-row', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'contact.0.name': 'Guta Abdi'
    });
    expect(config.contacts[0].name).toBe('Guta Abdi');
    // The untouched fields on that same row keep their placeholders.
    expect(config.contacts[0].email).toBe(defaultSiteConfig.contacts[0].email);
  });

  it('stores the third contact role per language', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'contact.2.dept.en': 'Finance & Administration',
      'contact.2.dept.am': 'ፋይናንስ እና አስተዳደር'
    });
    expect(config.dept2.en).toBe('Finance & Administration');
    expect(config.dept2.am).toBe('ፋይናንስ እና አስተዳደር');
    expect(config.dept2.om).toBeNull();
  });

  it('ignores keys that are not editable fields', () => {
    const config = mergeSiteConfig(defaultSiteConfig, {
      'site.url': 'https://evil.example',
      'contact.0.notAField': 'x'
    });
    // site.url is a build-time constant and must not be overridable.
    expect(JSON.stringify(config)).not.toContain('evil.example');
  });
});

describe('SETTING_FIELDS', () => {
  it('has a unique key per field', () => {
    const keys = SETTING_FIELDS.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('matches SETTING_KEYS, so the form and the write filter cannot drift', () => {
    expect(SETTING_KEYS.size).toBe(SETTING_FIELDS.length);
    for (const field of SETTING_FIELDS) {
      expect(SETTING_KEYS.has(field.key)).toBe(true);
    }
  });

  it('gives every field a non-empty label', () => {
    for (const field of SETTING_FIELDS) {
      expect(field.label.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('applyReplyDays', () => {
  const sentence = 'We usually reply within [X] working days.';

  it('substitutes the configured number', () => {
    expect(applyReplyDays(sentence, '3')).toBe(
      'We usually reply within 3 working days.'
    );
  });

  it('leaves the sentence alone when the reply time is unset', () => {
    // The [X] stays visible, which is what check-placeholders.mjs looks for.
    expect(applyReplyDays(sentence, null)).toBe(sentence);
  });

  it('is a no-op on a sentence with no token', () => {
    expect(applyReplyDays('No token here.', '3')).toBe('No token here.');
  });
});
