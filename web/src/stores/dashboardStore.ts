import { create } from 'zustand'
import type { GraphNode, TrackStat } from '../types/graph'

interface DashboardState {
  selectedNodeId: string | null
  selectedDocPath: string | null
  searchQuery: string
  articleExpanded: boolean
  graphCollapsed: boolean
  highlightedTrackId: string | null
  recentDocs: string[]
  setSearchQuery: (q: string) => void
  selectNode: (node: GraphNode | null) => void
  openDoc: (path: string, trackId?: string | null) => void
  closeArticle: () => void
  setArticleExpanded: (expanded: boolean) => void
  setGraphCollapsed: (collapsed: boolean) => void
  setHighlightedTrack: (trackId: string | null) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedNodeId: null,
  selectedDocPath: null,
  searchQuery: '',
  articleExpanded: false,
  graphCollapsed: false,
  highlightedTrackId: null,
  recentDocs: [],
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectNode: (node) => {
    if (!node) {
      set({ selectedNodeId: null, highlightedTrackId: null })
      return
    }
    set({
      selectedNodeId: node.id,
      highlightedTrackId: node.type === 'track' ? node.id : node.trackId ?? null,
    })
    if (node.path) {
      get().openDoc(node.path, node.type === 'track' ? node.id : node.trackId)
    }
  },
  openDoc: (path, trackId = null) => {
    const recent = [path, ...get().recentDocs.filter((p) => p !== path)].slice(0, 8)
    set({
      selectedDocPath: path,
      articleExpanded: false,
      highlightedTrackId: trackId,
      recentDocs: recent,
    })
    const url = new URL(window.location.href)
    url.searchParams.set('doc', path)
    window.history.replaceState({}, '', url.toString())
  },
  closeArticle: () => {
    set({ selectedDocPath: null, articleExpanded: false, selectedNodeId: null })
    const url = new URL(window.location.href)
    url.searchParams.delete('doc')
    window.history.replaceState({}, '', url.toString())
  },
  setArticleExpanded: (expanded) => set({ articleExpanded: expanded }),
  setGraphCollapsed: (collapsed) => set({ graphCollapsed: collapsed }),
  setHighlightedTrack: (trackId) => set({ highlightedTrackId: trackId }),
}))

export function findTrackForDoc(tracks: TrackStat[], docPath: string): TrackStat | undefined {
  return tracks.find((t) => t.docs.some((d) => d.path === docPath))
}
