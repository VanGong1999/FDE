export function Ticker({ items }: { items: string[] }) {
  const loop = [...items, ...items]
  return (
    <div className="overflow-hidden border-t border-line bg-panel/80">
      <div className="ticker-track gap-10 px-4 py-2 font-mono text-[11px] tracking-wide text-muted">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="text-accent">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
