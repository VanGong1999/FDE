import graph from './data/knowledge-graph.json'
import stats from './data/track-stats.json'
import { DashboardLayout } from './components/DashboardLayout'
import type { KnowledgeGraph, TrackStatsPayload } from './types/graph'

function App() {
  return (
    <DashboardLayout
      graph={graph as KnowledgeGraph}
      stats={stats as TrackStatsPayload}
    />
  )
}

export default App
