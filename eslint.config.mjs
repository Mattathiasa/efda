import nextConfig from 'eslint-config-next';

/* `next lint` was removed in Next 16 (see `npx next --help`), so linting now
   goes through plain `eslint .`. `eslint-config-next`'s default export is
   already a flat-config array with the core-web-vitals and TypeScript rule
   sets, so it only needs the project's own ignores added on top. */
const config = [
  {
    ignores: [
      // Reference copy of the original static design — not part of the app.
      'efda-website-design/**',
      // Build output and the separate verification build dir.
      '.next/**',
      '.next-verify/**'
    ]
  },
  ...nextConfig
];

export default config;
