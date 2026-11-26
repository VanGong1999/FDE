import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

export function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const spring = useSpring(value, { stiffness: 110, damping: 22 })
  const display = useTransform(spring, (v) => `${Math.round(v).toLocaleString('en-US')}${suffix}`)

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className="tabular-nums">{display}</motion.span>
}
