import { useEffect, useMemo, useRef } from 'react'
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d'
import type { GraphNode, KnowledgeGraph } from '../types/graph'
import { useDashboardStore } from '../stores/dashboardStore'

export function ForceGraphPanel({
  graph,
  width,
  height,
}: {
  graph: KnowledgeGraph
  width: number
  height: number
}) {
  const fgRef = useRef<ForceGraphMethods | null>(null)
  const selectedNodeId = useDashboardStore((s) => s.selectedNodeId)
  const highlightedTrackId = useDashboardStore((s) => s.highlightedTrackId)
  const searchQuery = useDashboardStore((s) => s.searchQuery)
  const selectNode = useDashboardStore((s) => s.selectNode)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return graph

    const matched = new Set(
      graph.nodes
        .filter((n) => n.name.toLowerCase().includes(q) || (n.path ?? '').toLowerCase().includes(q))
        .map((n) => n.id),
    )

    // Keep hubs/tracks connected to matches
    for (const link of graph.links) {
      const source = typeof link.source === 'string' ? link.source : link.source.id
      const target = typeof link.target === 'string' ? link.target : link.target.id
      if (matched.has(source) || matched.has(target)) {
        matched.add(source)
        matched.add(target)
      }
    }

    const nodes = graph.nodes.filter((n) => matched.has(n.id) || n.type === 'hub')
    const nodeIds = new Set(nodes.map((n) => n.id))
    const links = graph.links.filter((l) => {
      const source = typeof l.source === 'string' ? l.source : l.source.id
      const target = typeof l.target === 'string' ? l.target : l.target.id
      return nodeIds.has(source) && nodeIds.has(target)
    })
    return { ...graph, nodes, links }
  }, [graph, searchQuery])

  useEffect(() => {
    const id = window.setTimeout(() => {
      fgRef.current?.zoomToFit(400, 60)
    }, 200)
    return () => window.clearTimeout(id)
  }, [filtered.nodes.length, width, height])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-[#0c0d14]">
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-line bg-panel/80 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-muted backdrop-blur">
        FORCE GRAPH · {filtered.nodes.length} NODES
      </div>
      {width > 0 && height > 0 ? (
        <ForceGraph2D
          ref={fgRef}
          width={width}
          height={height}
          graphData={filtered}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={5}
          linkColor={() => 'rgba(255,255,255,0.16)'}
          linkWidth={1}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={1.2}
          cooldownTicks={80}
          warmupTicks={40}
          onNodeClick={(node) => selectNode(node as GraphNode)}
          onBackgroundClick={() => selectNode(null)}
          nodeCanvasObjectMode={() => 'replace'}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const n = node as GraphNode & { x?: number; y?: number }
            const x = n.x ?? 0
            const y = n.y ?? 0
            const selected = n.id === selectedNodeId
            const related =
              highlightedTrackId &&
              (n.id === highlightedTrackId || n.trackId === highlightedTrackId || n.type === 'hub')
            const radius = Math.sqrt(n.val || 4) * 1.7
            const alpha = !highlightedTrackId || related || selected ? 1 : 0.22

            ctx.globalAlpha = alpha
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = n.color || '#4ee2c5'
            ctx.fill()

            if (selected || n.type === 'track' || n.type === 'hub') {
              ctx.strokeStyle = selected ? '#ffffff' : 'rgba(255,255,255,0.35)'
              ctx.lineWidth = selected ? 2 : 1
              ctx.stroke()
            }

            const label = n.name
            const fontSize = Math.max(10 / globalScale, 2.4)
            if ((n.type !== 'doc' || selected || globalScale > 1.4) && globalScale > 0.55) {
              ctx.font = `${n.type === 'hub' ? 600 : 500} ${fontSize}px JetBrains Mono, monospace`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.fillStyle = selected ? '#ffffff' : 'rgba(232,232,232,0.85)'
              ctx.fillText(label.length > 14 ? `${label.slice(0, 14)}…` : label, x, y + radius + 2)
            }
            ctx.globalAlpha = 1
          }}
        />
      ) : null}
    </div>
  )
}
