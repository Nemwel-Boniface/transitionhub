/**
 * Wraps the portion of `text` that matched `query` in a <mark>. Mirrors the
 * bidirectional substring matching in findInDirectory: if query is found
 * inside text, only that slice is marked; if text is fully contained inside
 * a longer query, the whole thing is marked.
 */
export function Highlight({
  text,
  query,
  className = "bg-orange/25 text-charcoal rounded px-0.5",
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = q.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx !== -1) {
    return (
      <>
        {text.slice(0, idx)}
        <mark className={className}>{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  if (lowerText.length > 0 && lowerQuery.includes(lowerText)) {
    return <mark className={className}>{text}</mark>;
  }

  return <>{text}</>;
}
