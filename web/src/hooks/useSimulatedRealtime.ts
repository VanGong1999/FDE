import { useEffect, useState } from 'react'
import type { TrackStat, TrackStatsPayload } from '../types/graph'

export interface RealtimeSnapshot {
  activeSessions: number
  indexHits: number
  syncLagMs: number
  cloningProgress: number
  spark: number[]
  tracks: TrackStat[]
  tick: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function jitter(value: number, amount: number) {
  return value + (Math.random() * 2 - 1) * amount
}

export function useSimulatedRealtime(base: TrackStatsPayload): RealtimeSnapshot {
  const [snapshot, setSnapshot] = useState<RealtimeSnapshot>(() => ({
    activeSessions: 12,
    indexHits: base.docCount * 3,
    syncLagMs: 42,
    cloningProgress: 67,
    spark: Array.from({ length: 16 }, () => 20 + Math.random() * 60),
    tracks: base.tracks.map((t) => ({ ...t })),
    tick: 0,
  }))

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timer = window.setInterval(() => {
      setSnapshot((prev) => {
        const tracks = prev.tracks.map((track, index) => {
          const nextProgress = clamp(jitter(track.progress, 2.2), 8, 99)
          const statuses = ['ACTIVE', 'READY', 'SYNC'] as const
          const status =
            Math.random() > 0.82
              ? statuses[(index + prev.tick) % statuses.length]
              : track.status
          return { ...track, progress: Math.round(nextProgress), status }
        })

        const spark = [...prev.spark.slice(1), clamp(jitter(prev.spark.at(-1) ?? 40, 12), 8, 95)]

        return {
          activeSessions: Math.round(clamp(jitter(prev.activeSessions, 1.8), 4, 48)),
          indexHits: Math.round(prev.indexHits + Math.random() * 6),
          syncLagMs: Math.round(clamp(jitter(prev.syncLagMs, 8), 12, 120)),
          cloningProgress: Math.round(clamp(jitter(prev.cloningProgress, 3), 20, 99)),
          spark,
          tracks,
          tick: prev.tick + 1,
        }
      })
    }, 1600)

    return () => window.clearInterval(timer)
  }, [base.docCount])

  return snapshot
}
