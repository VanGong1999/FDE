export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.replace(/^\//, '')
  return `${base}${normalized}`
}

export function contentUrl(docPath: string): string {
  return withBase(docPath.replace(/^\//, ''))
}

export function resolveMarkdownAsset(docPath: string, src: string): string {
  if (/^(https?:|data:|mailto:|#)/i.test(src)) return src
  if (src.startsWith('/')) return withBase(src.replace(/^\//, ''))

  const dir = docPath.replace(/^\//, '').split('/').slice(0, -1).join('/')
  const joined = pathJoin(dir, src)
  return withBase(joined)
}

function pathJoin(...parts: string[]): string {
  const stack: string[] = []
  for (const part of parts.join('/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') {
      stack.pop()
      continue
    }
    stack.push(part)
  }
  return stack.join('/')
}

export function normalizeDocPath(input: string | null | undefined): string | null {
  if (!input) return null
  let value = decodeURIComponent(input).replace(/^#\/?/, '').replace(/^\//, '')
  if (value.endsWith('/')) value = value.slice(0, -1)
  if (!value.endsWith('.md') && value.startsWith('docs/')) value = `${value}.md`
  if (!value.startsWith('docs/') && !value.includes('/')) return null
  return value
}
