/* Shared between the client form and the server route. Keep this free of any
   server-only imports - ContactForm is a client component, and anything it
   reaches ends up in the browser bundle. */
export const TOPICS = ['partner', 'program', 'visit', 'other'] as const;
export type Topic = (typeof TOPICS)[number];
