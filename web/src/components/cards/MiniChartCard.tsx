import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export function MiniChartCard({
  label,
  valueLabel,
  data,
}: {
  label: string
  valueLabel: string
  data: number[]
}) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <div className="rounded-xl border border-line bg-panel p-3.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</span>
        <span className="text-sm font-semibold text-ink">{valueLabel}</span>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ee2c5" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#4ee2c5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#4ee2c5"
              strokeWidth={1.5}
              fill="url(#sparkFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
