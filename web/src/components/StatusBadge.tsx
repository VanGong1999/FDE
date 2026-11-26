const STYLES: Record<string, string> = {
  ACTIVE: 'text-[#55e1a6] border-[#55e1a6]/40 bg-[#55e1a6]/10',
  READY: 'text-[#7dd3fc] border-[#7dd3fc]/40 bg-[#7dd3fc]/10',
  SYNC: 'text-[#ffb454] border-[#ffb454]/40 bg-[#ffb454]/10',
}

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? 'text-muted border-line bg-white/5'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em] ${style}`}
    >
      <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
