/* Streaming boundary for this segment.

   These pages are statically generated and prefetched, so this is rarely
   seen. It earns its place on the unstable connections this site is built
   for: when a prefetch has not landed, Next can paint the shared shell
   immediately instead of holding a blank page until the payload arrives.

   Deliberately almost nothing. A skeleton that flashes for 80ms and is then
   replaced is more jarring than the site's own background.

   There is deliberately NO loading.tsx at the [locale] level. That segment
   contains the [...rest] catch-all, and a streaming boundary above it commits
   a 200 to the wire before notFound() can set 404 - which silently turns
   every missing page into a soft 404 for search engines. */
export default function Loading() {
  return <div style={{minHeight: '60vh'}} aria-busy="true" />;
}
