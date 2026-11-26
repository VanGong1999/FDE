export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = []
  const seen = new Map<string, number>()

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
    if (!match) continue
    const level = match[1].length as 2 | 3
    const text = match[2].replace(/#+\s*$/, '').trim()
    if (!text) continue
    let id = slugifyHeading(text)
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`
    items.push({ id, text, level })
  }

  return items
}
