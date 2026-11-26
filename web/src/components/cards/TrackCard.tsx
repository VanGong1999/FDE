import type { TrackStat } from '../../types/graph'
import { StatusBadge } from '../StatusBadge'

export function TrackCard({
  track,
  active,
  onClick,
}: {
  track: TrackStat
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${
        active
          ? 'border-accent/40 bg-accent-dim'
          : 'border-line bg-panel hover:border-line-strong hover:bg-panel-raised'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: track.color, boxShadow: `0 0 10px ${track.color}` }}
        />
        <StatusBadge status={track.status} />
      </div>
      <div className="text-sm font-semibold text-ink">{track.name}</div>
      <div className="mt-1 font-mono text-[10px] text-muted">
        {track.docCount} DOCS · {track.progress}%
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${track.progress}%`, background: track.color }}
        />
      </div>
    </button>
  )
}
