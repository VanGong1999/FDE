import { StatusBadge } from '../StatusBadge'
import { AnimatedNumber } from '../AnimatedNumber'

export function ProgressCard({
  title,
  progress,
  status,
  subtitle,
}: {
  title: string
  progress: number
  status: string
  subtitle?: string
}) {
  return (
    <div className="rounded-xl border border-line bg-panel p-3.5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">PIPELINE</div>
          <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
          {subtitle ? <div className="mt-0.5 text-xs text-muted">{subtitle}</div> : null}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mb-1.5 flex items-end justify-between">
        <span className="text-xl font-bold text-accent">
          <AnimatedNumber value={progress} suffix="%" />
        </span>
        <span className="font-mono text-[10px] text-subtle">CLONE / INDEX</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
