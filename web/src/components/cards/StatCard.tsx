import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatedNumber } from '../AnimatedNumber'

export function StatCard({
  label,
  value,
  hint,
  icon,
  flashKey,
}: {
  label: string
  value: number
  hint?: string
  icon?: ReactNode
  flashKey?: number
}) {
  return (
    <motion.div
      key={flashKey}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-line bg-panel p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold tracking-tight text-ink">
        <AnimatedNumber value={value} />
      </div>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </motion.div>
  )
}
