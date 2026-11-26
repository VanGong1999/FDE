import type { TrackDoc, TrackStat } from '../types/graph'

export interface FlatDoc extends TrackDoc {
  trackId: string
  trackName: string
}

export function flattenDocs(tracks: TrackStat[]): FlatDoc[] {
  return tracks.flatMap((track) =>
    track.docs.map((doc) => ({
      ...doc,
      trackId: track.id,
      trackName: track.name,
    })),
  )
}

export function findDocNeighbors(docs: FlatDoc[], currentPath: string) {
  const index = docs.findIndex((d) => d.path === currentPath)
  if (index < 0) {
    return { index: -1, prev: null, next: null, current: null }
  }
  return {
    index,
    prev: index > 0 ? docs[index - 1] : null,
    next: index < docs.length - 1 ? docs[index + 1] : null,
    current: docs[index],
  }
}
