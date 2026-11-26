import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { KnowledgeGraph, TrackStatsPayload } from '../types/graph'
import { useSimulatedRealtime } from '../hooks/useSimulatedRealtime'
import { findTrackForDoc, useDashboardStore } from '../stores/dashboardStore'
import { normalizeDocPath } from '../lib/paths'
import { ArticlePanel } from './ArticlePanel'
import { ForceGraphPanel } from './ForceGraphPanel'
import { Ticker } from './Ticker'
import { TopBar } from './TopBar'
import { ListCard } from './cards/ListCard'
import { MiniChartCard } from './cards/MiniChartCard'
import { ProgressCard } from './cards/ProgressCard'
import { StatCard } from './cards/StatCard'
import { TrackCard } from './cards/TrackCard'

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
}

export function DashboardLayout({
  graph,
  stats,
}: {
  graph: KnowledgeGraph
  stats: TrackStatsPayload
}) {
  const realtime = useSimulatedRealtime(stats)
  const searchQuery = useDashboardStore((s) => s.searchQuery)
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery)
  const selectedDocPath = useDashboardStore((s) => s.selectedDocPath)
  const graphCollapsed = useDashboardStore((s) => s.graphCollapsed)
  const setGraphCollapsed = useDashboardStore((s) => s.setGraphCollapsed)
  const openDoc = useDashboardStore((s) => s.openDoc)
  const setHighlightedTrack = useDashboardStore((s) => s.setHighlightedTrack)
  const highlightedTrackId = useDashboardStore((s) => s.highlightedTrackId)
  const recentDocs = useDashboardStore((s) => s.recentDocs)

  const graphHostRef = useRef<HTMLDivElement>(null)
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 })
  const reading = Boolean(selectedDocPath)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromQuery = normalizeDocPath(params.get('doc'))
    if (fromQuery) {
      const track = findTrackForDoc(stats.tracks, fromQuery)
      openDoc(fromQuery, track?.id ?? null)
      return
    }

    // Legacy Docsify hash: #/docs/....md
    const hashPath = normalizeDocPath(window.location.hash)
    if (hashPath?.startsWith('docs/')) {
      const track = findTrackForDoc(stats.tracks, hashPath)
      openDoc(hashPath, track?.id ?? null)
    }
  }, [openDoc, stats.tracks])

  useEffect(() => {
    if (reading) return
    const el = graphHostRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      setGraphSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [graphCollapsed, reading])

  const activeTrack =
    realtime.tracks.find((t) => t.id === highlightedTrackId) ?? realtime.tracks[0]

  const listItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const source = activeTrack?.docs ?? []
    if (!q) return source.slice(0, 12)
    return source.filter((d) => d.title.toLowerCase().includes(q) || d.path.toLowerCase().includes(q))
  }, [activeTrack, searchQuery])

  const recentItems = useMemo(() => {
    const allDocs = stats.tracks.flatMap((t) => t.docs)
    return recentDocs
      .map((path) => allDocs.find((d) => d.path === path))
      .filter(Boolean)
      .slice(0, 6) as { id: string; title: string; path: string }[]
  }, [recentDocs, stats.tracks])

  const tickerItems = [
    `TRACKS ${stats.trackCount} · DOCS ${stats.docCount}`,
    'PATH: 角色定位 → 交付方法 → AI 落地 → 面试与模板',
    `INDEX HITS ${realtime.indexHits}`,
    `SYNC LAG ${realtime.syncLagMs}ms`,
    activeTrack ? `FOCUS · ${activeTrack.name}` : 'FOCUS · ALL',
    '姊妹库: AI 推理工程 · AI Agent',
  ]

  return (
    <div className="flex h-dvh min-h-0 flex-col text-ink">
      <TopBar
        trackCount={stats.trackCount}
        docCount={stats.docCount}
        activeSessions={realtime.activeSessions}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onToggleGraph={() => setGraphCollapsed(!graphCollapsed)}
      />

      {reading && selectedDocPath ? (
        <div className="min-h-0 flex-1 p-3">
          <ArticlePanel docPath={selectedDocPath} stats={stats} />
        </div>
      ) : (
        <>
          <div className="relative grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-1">
            <div
              className={`${
                graphCollapsed ? 'hidden' : 'flex'
              } min-h-[240px] flex-col lg:min-h-0`}
            >
              <div ref={graphHostRef} className="min-h-0 flex-1">
                <ForceGraphPanel graph={graph} width={graphSize.width} height={graphSize.height} />
              </div>
            </div>

            <div className="relative flex min-h-0 flex-col">
              <div className="grid h-full min-h-0 grid-cols-2 gap-3 overflow-auto xl:grid-cols-3">
                <motion.div custom={0} initial="hidden" animate="show" variants={panelVariants}>
                  <StatCard
                    label="DOC CORPUS"
                    value={stats.docCount}
                    hint="侧栏索引文档"
                    flashKey={realtime.tick}
                  />
                </motion.div>
                <motion.div custom={1} initial="hidden" animate="show" variants={panelVariants}>
                  <StatCard
                    label="LIVE SESSIONS"
                    value={realtime.activeSessions}
                    hint="模拟并发阅读"
                    flashKey={realtime.tick}
                  />
                </motion.div>
                <motion.div custom={2} initial="hidden" animate="show" variants={panelVariants}>
                  <ProgressCard
                    title="Knowledge Clone"
                    progress={realtime.cloningProgress}
                    status="ACTIVE"
                    subtitle="索引增量同步"
                  />
                </motion.div>
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="show"
                  variants={panelVariants}
                  className="col-span-2 xl:col-span-1"
                >
                  <MiniChartCard
                    label="QUERY THROUGHPUT"
                    valueLabel={`${realtime.indexHits} hits`}
                    data={realtime.spark}
                  />
                </motion.div>
                <motion.div
                  custom={4}
                  initial="hidden"
                  animate="show"
                  variants={panelVariants}
                  className="col-span-2 min-h-[220px] xl:col-span-2"
                >
                  <ListCard
                    title={activeTrack ? `${activeTrack.name} · INDEX` : 'DOC INDEX'}
                    items={listItems}
                    activePath={selectedDocPath}
                    onSelect={(path) => openDoc(path, activeTrack?.id)}
                  />
                </motion.div>
                <motion.div
                  custom={5}
                  initial="hidden"
                  animate="show"
                  variants={panelVariants}
                  className="col-span-2 grid max-h-[280px] grid-cols-2 gap-3 overflow-auto xl:col-span-3 xl:grid-cols-4"
                >
                  {realtime.tracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      active={track.id === highlightedTrackId}
                      onClick={() => {
                        setHighlightedTrack(track.id)
                        if (track.docs[0]) openDoc(track.docs[0].path, track.id)
                      }}
                    />
                  ))}
                </motion.div>
                {recentItems.length > 0 ? (
                  <motion.div
                    custom={6}
                    initial="hidden"
                    animate="show"
                    variants={panelVariants}
                    className="col-span-2 xl:col-span-3"
                  >
                    <ListCard
                      title="RECENT"
                      items={recentItems}
                      activePath={selectedDocPath}
                      onSelect={(path) => {
                        const track = findTrackForDoc(stats.tracks, path)
                        openDoc(path, track?.id ?? null)
                      }}
                    />
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
          <Ticker items={tickerItems} />
        </>
      )}
    </div>
  )
}
