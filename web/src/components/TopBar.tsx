import { ExternalLink, Menu, Search } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'

export function TopBar({
  trackCount,
  docCount,
  activeSessions,
  searchQuery,
  onSearch,
  onToggleGraph,
}: {
  trackCount: number
  docCount: number
  activeSessions: number
  searchQuery: string
  onSearch: (value: string) => void
  onToggleGraph: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-[#07080d]/92 px-3 backdrop-blur md:px-5">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel text-muted lg:hidden"
        onClick={onToggleGraph}
        aria-label="切换图谱面板"
      >
        <Menu size={16} />
      </button>

      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#9bffe9] to-[#32cdb2] font-mono text-sm font-bold text-[#07111f]">
          F
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold tracking-[0.12em]">FDE OPS</div>
          <div className="hidden font-mono text-[10px] tracking-[0.14em] text-subtle sm:block">
            FIELD DEPLOYMENT · KNOWLEDGE CONSOLE
          </div>
        </div>
      </div>

      <div className="ml-2 hidden items-center gap-2 font-mono text-[11px] text-muted md:flex">
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-ok" />
        LIVE
      </div>

      <div className="ml-auto hidden items-center gap-4 lg:flex">
        <Metric label="TRACKS" value={trackCount} />
        <Metric label="DOCS" value={docCount} />
        <Metric label="SESSIONS" value={activeSessions} />
      </div>

      <label className="relative ml-auto flex w-full max-w-[220px] items-center lg:ml-4 lg:max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3 text-subtle" />
        <input
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="搜索轨道 / 文档"
          className="h-9 w-full rounded-lg border border-line bg-panel pl-9 pr-3 text-sm text-ink placeholder:text-subtle outline-none focus:border-accent/40"
        />
      </label>

      <a
        href="https://github.com/VanGong1999/FDE"
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel text-muted hover:text-accent"
        aria-label="GitHub"
      >
        <ExternalLink size={16} />
      </a>
    </header>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-right">
      <div className="font-mono text-[9px] tracking-[0.16em] text-subtle">{label}</div>
      <div className="text-sm font-bold text-ink">
        <AnimatedNumber value={value} />
      </div>
    </div>
  )
}
