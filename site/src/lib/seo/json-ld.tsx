// JSON-LD script tag. Adapted from darkroom.engineering's Satūs starter (MIT).
// Escapes `<` so a CMS string containing "</script>" cannot close the tag early.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
