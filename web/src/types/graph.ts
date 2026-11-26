export type NodeType = 'hub' | 'track' | 'doc'

export interface GraphNode {
  id: string
  name: string
  type: NodeType
  group: number
  val: number
  color: string
  path: string | null
  trackId?: string
  docCount?: number
}

export interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
}

export interface KnowledgeGraph {
  generatedAt: string
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface TrackDoc {
  id: string
  title: string
  path: string
}

export interface TrackStat {
  id: string
  name: string
  color: string
  docCount: number
  graphDocCount: number
  docs: TrackDoc[]
  progress: number
  status: 'ACTIVE' | 'READY' | 'SYNC' | string
}

export interface TrackStatsPayload {
  generatedAt: string
  trackCount: number
  docCount: number
  graphNodeCount: number
  tracks: TrackStat[]
}
