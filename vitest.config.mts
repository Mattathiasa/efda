import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  /* Mirrors the `@/*` -> `./*` mapping in tsconfig.json. Vitest does not read
     tsconfig paths, and lib/ uses the alias (lib/seo.tsx, lib/site-config.ts),
     so without this any test that reaches a module importing `@/content/...`
     fails to resolve rather than failing an assertion. */
  resolve: {
    alias: {'@': fileURLToPath(new URL('.', import.meta.url))}
  },
  test: {
    environment: 'node',
    // Kept narrow on purpose: it keeps testable logic as pure functions in
    // lib/ rather than inviting component tests that would need jsdom.
    include: ['lib/**/*.test.ts']
  }
});
