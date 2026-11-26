import type { TrackDoc } from '../../types/graph'

export function ListCard({
  title,
  items,
  onSelect,
  activePath,
}: {
  title: string
  items: TrackDoc[]
  onSelect: (path: string) => void
  activePath?: string | null
}) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-line bg-panel p-3.5">
      <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{title}</div>
      <ul className="min-h-0 flex-1 space-y-1 overflow-auto pr-1">
        {items.map((item, index) => {
          const active = item.path === activePath
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.path)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                  active
                    ? 'bg-accent-dim text-accent'
                    : 'text-muted hover:bg-white/5 hover:text-ink'
                }`}
              >
                <span className="font-mono text-[10px] text-subtle">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="line-clamp-1">{item.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
