declare module 'react-force-graph-2d' {
  import type { ComponentType, CSSProperties } from 'react'

  export interface ForceGraphMethods {
    zoomToFit: (ms?: number, padding?: number) => void
    d3Force: (name: string, force?: unknown) => unknown
    centerAt: (x?: number, y?: number, ms?: number) => void
    zoom: (scale?: number, ms?: number) => number
  }

  export interface ForceGraphProps {
    graphData: { nodes: unknown[]; links: unknown[] }
    nodeId?: string
    nodeLabel?: string | ((node: any) => string)
    nodeVal?: string | ((node: any) => number)
    nodeColor?: string | ((node: any) => string)
    nodeRelSize?: number
    linkColor?: string | ((link: any) => string)
    linkWidth?: number | ((link: any) => number)
    backgroundColor?: string
    width?: number
    height?: number
    cooldownTicks?: number
    warmupTicks?: number
    enableNodeDrag?: boolean
    enableZoomInteraction?: boolean
    onNodeClick?: (node: any, event: MouseEvent) => void
    onBackgroundClick?: () => void
    nodeCanvasObject?: (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => void
    nodeCanvasObjectMode?: string | ((node: any) => string)
    linkDirectionalParticles?: number | ((link: any) => number)
    linkDirectionalParticleWidth?: number
    style?: CSSProperties
  }

  const ForceGraph2D: ComponentType<ForceGraphProps & { ref?: React.Ref<ForceGraphMethods> }>
  export default ForceGraph2D
}
