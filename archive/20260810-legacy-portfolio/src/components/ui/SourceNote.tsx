/**
 * Unverified items, emitted into the HTML source as real comment nodes and
 * never as published prose.
 *
 * JSX comments are compiler syntax: `{/* ... *\/}` never reaches the output,
 * so a TODO written that way would silently vanish from the built page. React
 * has no comment element either, which leaves injecting the comment as raw
 * markup as the only way to get a source comment into a static export.
 *
 * The wrapper is a zero-size `<span hidden>` carrying nothing but comment
 * nodes, so it contributes no box, no text and no accessible name. Comment
 * text is stripped of any sequence that could close the comment early.
 */
export function SourceNote({ notes, label }: { notes: readonly string[]; label: string }) {
  if (!notes.length) return null

  const html = notes
    // `--` cannot appear inside an HTML comment, and `>` after it would end
    // the node early and spill the rest of the note into the page as text.
    .map((n) => `<!-- TODO CONFIRM (${label}): ${n.replace(/--+/g, '-').replace(/>/g, '')} -->`)
    .join('\n')

  return <span hidden dangerouslySetInnerHTML={{ __html: html }} />
}
