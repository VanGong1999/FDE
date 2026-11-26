import { ArrowLeft, ChevronLeft, ChevronRight, List, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { findDocNeighbors, flattenDocs, type FlatDoc } from '../lib/docNav'
import { extractToc, type TocItem } from '../lib/markdownToc'
import { contentUrl, resolveMarkdownAsset } from '../lib/paths'
import { useDashboardStore } from '../stores/dashboardStore'
import type { TrackStatsPayload } from '../types/graph'

export function ArticlePanel({
  docPath,
  stats,
}: {
  docPath: string
  stats: TrackStatsPayload
}) {
  const closeArticle = useDashboardStore((s) => s.closeArticle)
  const openDoc = useDashboardStore((s) => s.openDoc)
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeHeading, setActiveHeading] = useState<string | null>(null)
  const [tocOpen, setTocOpen] = useState(false)
  const articleRef = useRef<HTMLElement>(null)

  const flatDocs = useMemo(() => flattenDocs(stats.tracks), [stats.tracks])
  const neighbors = useMemo(() => findDocNeighbors(flatDocs, docPath), [flatDocs, docPath])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setActiveHeading(null)
    setTocOpen(false)
    if (articleRef.current) articleRef.current.scrollTop = 0

    fetch(contentUrl(docPath))
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) {
          setMarkdown(text)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [docPath])

  const toc = useMemo(() => extractToc(markdown), [markdown])

  const title = useMemo(() => {
    const match = markdown.match(/^#\s+(.+)$/m)
    return (
      match?.[1] ??
      neighbors.current?.title ??
      docPath.split('/').pop()?.replace(/\.md$/, '') ??
      'Document'
    )
  }, [markdown, docPath, neighbors.current?.title])

  useEffect(() => {
    const root = articleRef.current
    if (!root || toc.length === 0 || loading) return

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveHeading(visible[0].target.id)
      },
      { root, rootMargin: '0px 0px -70% 0px', threshold: [0, 1] },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [toc, loading, docPath])

  const goTo = (doc: FlatDoc | null) => {
    if (!doc) return
    openDoc(doc.path, doc.trackId)
  }

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (!el || !articleRef.current) return
    articleRef.current.scrollTo({
      top: el.offsetTop - 12,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
    setActiveHeading(id)
    setTocOpen(false)
  }

  let headingRenderIndex = 0

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-panel">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2.5 md:px-4">
        <button
          type="button"
          onClick={closeArticle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-muted hover:text-accent"
        >
          <ArrowLeft size={14} />
          返回操作台
        </button>

        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] tracking-[0.14em] text-subtle">
            {neighbors.current?.trackName ?? 'ARTICLE'}
            {neighbors.index >= 0 ? ` · ${neighbors.index + 1}/${flatDocs.length}` : ''}
          </div>
          <div className="truncate text-sm font-semibold text-ink">{title}</div>
        </div>

        <button
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2 text-xs text-muted lg:hidden"
          onClick={() => setTocOpen((v) => !v)}
          aria-label="目录"
        >
          <List size={14} />
          目录
        </button>

        <NavButtons prev={neighbors.prev} next={neighbors.next} onGo={goTo} />

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:text-warn"
          onClick={closeArticle}
          aria-label="关闭文章"
        >
          <X size={14} />
        </button>
      </header>

      <div className="relative grid min-h-0 flex-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          className={`${
            tocOpen ? 'absolute inset-y-0 left-0 z-20 flex w-[min(280px,85vw)]' : 'hidden'
          } flex-col border-r border-line bg-panel-raised lg:static lg:flex`}
        >
          <div className="border-b border-line px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-subtle">
            目录 · TOC
          </div>
          <nav className="min-h-0 flex-1 overflow-auto px-2 py-2">
            {toc.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted">本文暂无二级标题</p>
            ) : (
              <ul className="space-y-0.5">
                {toc.map((item) => (
                  <TocLink
                    key={item.id}
                    item={item}
                    active={activeHeading === item.id}
                    onClick={() => scrollToHeading(item.id)}
                  />
                ))}
              </ul>
            )}
          </nav>
        </aside>

        {tocOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-10 bg-black/40 lg:hidden"
            aria-label="关闭目录"
            onClick={() => setTocOpen(false)}
          />
        ) : null}

        <article ref={articleRef} className="min-h-0 overflow-auto px-4 py-4 md:px-8 md:py-6">
          {loading ? (
            <div className="font-mono text-xs text-muted">Loading markdown…</div>
          ) : error ? (
            <div className="rounded-lg border border-warn/30 bg-warn/10 p-3 text-sm text-warn">
              无法加载文档：{error}
            </div>
          ) : (
            <>
              <div className="markdown-body mx-auto max-w-3xl">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const item = toc[headingRenderIndex++]
                      return (
                        <h2 id={item?.id} className="scroll-mt-4">
                          {children}
                        </h2>
                      )
                    },
                    h3: ({ children }) => {
                      const item = toc[headingRenderIndex++]
                      return (
                        <h3 id={item?.id} className="scroll-mt-4">
                          {children}
                        </h3>
                      )
                    },
                    a: ({ href, children }) => {
                      if (href?.startsWith('/docs/') || href?.endsWith('.md')) {
                        const path = href.replace(/^\//, '')
                        const target = flatDocs.find((d) => d.path === path)
                        return (
                          <button
                            type="button"
                            className="text-accent"
                            onClick={() => openDoc(path, target?.trackId)}
                          >
                            {children}
                          </button>
                        )
                      }
                      return (
                        <a href={href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      )
                    },
                    img: ({ src, alt }) => (
                      <img src={resolveMarkdownAsset(docPath, src ?? '')} alt={alt ?? ''} />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>

              <footer className="mx-auto mt-10 max-w-3xl border-t border-line pt-5 pb-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  <NeighborCard
                    label="上一篇"
                    doc={neighbors.prev}
                    align="left"
                    onGo={goTo}
                    icon={<ChevronLeft size={16} />}
                  />
                  <NeighborCard
                    label="下一篇"
                    doc={neighbors.next}
                    align="right"
                    onGo={goTo}
                    icon={<ChevronRight size={16} />}
                  />
                </div>
              </footer>
            </>
          )}
        </article>
      </div>
    </section>
  )
}

function TocLink({
  item,
  active,
  onClick,
}: {
  item: TocItem
  active: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition ${
          item.level === 3 ? 'pl-4' : ''
        } ${
          active
            ? 'bg-accent-dim font-medium text-accent'
            : 'text-muted hover:bg-white/5 hover:text-ink'
        }`}
      >
        <span className="line-clamp-2">{item.text}</span>
      </button>
    </li>
  )
}

function NavButtons({
  prev,
  next,
  onGo,
}: {
  prev: FlatDoc | null
  next: FlatDoc | null
  onGo: (doc: FlatDoc | null) => void
}) {
  return (
    <div className="hidden items-center gap-1 sm:flex">
      <button
        type="button"
        disabled={!prev}
        onClick={() => onGo(prev)}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2 text-xs text-muted enabled:hover:text-accent disabled:opacity-35"
        title={prev?.title}
      >
        <ChevronLeft size={14} />
        上一篇
      </button>
      <button
        type="button"
        disabled={!next}
        onClick={() => onGo(next)}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2 text-xs text-muted enabled:hover:text-accent disabled:opacity-35"
        title={next?.title}
      >
        下一篇
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

function NeighborCard({
  label,
  doc,
  align,
  onGo,
  icon,
}: {
  label: string
  doc: FlatDoc | null
  align: 'left' | 'right'
  onGo: (doc: FlatDoc | null) => void
  icon: ReactNode
}) {
  if (!doc) {
    return (
      <div
        className={`rounded-xl border border-dashed border-line px-4 py-3 text-xs text-subtle ${
          align === 'right' ? 'text-right' : ''
        }`}
      >
        没有{label}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onGo(doc)}
      className={`rounded-xl border border-line bg-canvas px-4 py-3 text-left transition hover:border-accent/40 hover:bg-accent-dim ${
        align === 'right' ? 'sm:text-right' : ''
      }`}
    >
      <div
        className={`mb-1 flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] text-subtle ${
          align === 'right' ? 'sm:justify-end' : ''
        }`}
      >
        {align === 'left' ? icon : null}
        {label}
        {align === 'right' ? icon : null}
      </div>
      <div className="text-sm font-semibold text-ink">{doc.title}</div>
      <div className="mt-0.5 text-[11px] text-muted">{doc.trackName}</div>
    </button>
  )
}
