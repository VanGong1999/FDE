#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const outDir = path.resolve(__dirname, '../src/data')

const TRACK_COLORS = [
  '#4ee2c5',
  '#7dd3fc',
  '#ffb454',
  '#c4b5fd',
  '#fb7185',
  '#34d399',
  '#f472b6',
  '#a3e635',
  '#38bdf8',
  '#fbbf24',
  '#818cf8',
  '#2dd4bf',
]

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function parseSidebar(text) {
  const tracks = []
  let current = null

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const heading = line.match(/^\*\*(.+?)\*\*(.*)$/)
    if (heading) {
      let name = heading[1].trim()
      const suffix = heading[2].trim()
      // Keep short annotation like course series name, drop long parentheticals
      if (suffix && suffix.length < 24 && !suffix.startsWith('（') && !suffix.startsWith('(')) {
        name = `${name} ${suffix}`.trim()
      }
      if (name === '姊妹知识库' || name === '其他') {
        current = null
        continue
      }
      current = {
        id: `track:${slugify(name)}`,
        name,
        docs: [],
      }
      tracks.push(current)
      continue
    }

    const link = line.match(/^\*\s+\[(.+?)\]\((.+?)\)\s*$/)
    if (!link || !current) continue

    const title = link[1].trim()
    const href = link[2].trim()
    if (!href.startsWith('/docs/')) continue

    const docPath = href.replace(/^\//, '')
    current.docs.push({
      id: `doc:${docPath}`,
      title,
      path: docPath,
      trackId: current.id,
    })
  }

  return tracks.filter((t) => t.docs.length > 0)
}

function buildGraph(tracks) {
  /** @type {Array<Record<string, unknown>>} */
  const nodes = []
  /** @type {Array<{source: string, target: string}>} */
  const links = []
  /** @type {Array<Record<string, unknown>>} */
  const trackStats = []

  // Hub connecting all tracks lightly
  nodes.push({
    id: 'hub:fde',
    name: 'FDE',
    type: 'hub',
    group: 0,
    val: 28,
    color: '#4ee2c5',
    path: null,
  })

  tracks.forEach((track, index) => {
    const color = TRACK_COLORS[index % TRACK_COLORS.length]
    const group = index + 1
    nodes.push({
      id: track.id,
      name: track.name,
      type: 'track',
      group,
      val: 16 + Math.min(track.docs.length, 12),
      color,
      path: track.docs[0]?.path ?? null,
      docCount: track.docs.length,
    })
    links.push({ source: 'hub:fde', target: track.id })

    // Graph density control: first 6 docs as graph nodes, rest list-only
    const graphDocs = track.docs.slice(0, 6)
    const listDocs = track.docs

    graphDocs.forEach((doc, docIndex) => {
      nodes.push({
        id: doc.id,
        name: doc.title,
        type: 'doc',
        group,
        val: 4 + Math.max(0, 4 - docIndex),
        color,
        path: doc.path,
        trackId: track.id,
      })
      links.push({ source: track.id, target: doc.id })
      if (docIndex > 0) {
        links.push({
          source: graphDocs[docIndex - 1].id,
          target: doc.id,
        })
      }
    })

    trackStats.push({
      id: track.id,
      name: track.name,
      color,
      docCount: track.docs.length,
      graphDocCount: graphDocs.length,
      docs: listDocs.map((d) => ({
        id: d.id,
        title: d.title,
        path: d.path,
      })),
      progress: Math.round(35 + ((index * 17) % 55)),
      status: index % 3 === 0 ? 'ACTIVE' : index % 3 === 1 ? 'READY' : 'SYNC',
    })
  })

  return {
    graph: {
      generatedAt: new Date().toISOString(),
      nodes,
      links,
    },
    stats: {
      generatedAt: new Date().toISOString(),
      trackCount: tracks.length,
      docCount: tracks.reduce((sum, t) => sum + t.docs.length, 0),
      graphNodeCount: nodes.length,
      tracks: trackStats,
    },
  }
}

async function main() {
  const sidebarPath = path.join(root, '_sidebar.md')
  const text = await readFile(sidebarPath, 'utf8')
  const tracks = parseSidebar(text)
  const { graph, stats } = buildGraph(tracks)

  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'knowledge-graph.json'), JSON.stringify(graph, null, 2))
  await writeFile(path.join(outDir, 'track-stats.json'), JSON.stringify(stats, null, 2))

  console.log(
    `Generated graph: ${stats.trackCount} tracks, ${stats.docCount} docs, ${stats.graphNodeCount} graph nodes`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
