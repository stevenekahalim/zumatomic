"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface CountUpProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  triggerOnView?: boolean
}

export function CountUp({
  value,
  duration = 1,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  triggerOnView = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hasStarted, setHasStarted] = useState(!triggerOnView)

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (val) =>
    val.toFixed(decimals)
  )

  useEffect(() => {
    if (triggerOnView && isInView) {
      setTimeout(() => {
        setHasStarted(true)
        spring.set(value)
      }, delay * 1000)
    } else if (!triggerOnView) {
      setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
    }
  }, [isInView, triggerOnView, value, spring, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// MMR change indicator with animation
interface MMRChangeProps {
  change: number
  className?: string
}

export function MMRChange({ change, className }: MMRChangeProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <motion.span
      initial={{ opacity: 0, y: isPositive ? 10 : -10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "inline-flex items-center font-bold",
        isPositive && "text-atomic-green",
        isNegative && "text-red-500",
        !isPositive && !isNegative && "text-[var(--text-secondary)]",
        className
      )}
    >
      {isPositive && "+"}
      <CountUp value={change} triggerOnView={false} />
    </motion.span>
  )
}

// Animated score display
interface AnimatedScoreProps {
  home: number
  away: number
  className?: string
  size?: "sm" | "md" | "lg"
}

const scoreSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
}

export function AnimatedScore({
  home,
  away,
  className,
  size = "md",
}: AnimatedScoreProps) {
  return (
    <div className={cn("flex items-center gap-2 font-bold", scoreSizes[size], className)}>
      <motion.span
        key={`home-${home}`}
        initial={{ scale: 1.5, color: "#FBBF24" }}
        animate={{ scale: 1, color: "#FFFFFF" }}
        transition={{ duration: 0.3 }}
      >
        {home}
      </motion.span>
      <span className="text-[var(--text-secondary)]">-</span>
      <motion.span
        key={`away-${away}`}
        initial={{ scale: 1.5, color: "#FBBF24" }}
        animate={{ scale: 1, color: "#FFFFFF" }}
        transition={{ duration: 0.3 }}
      >
        {away}
      </motion.span>
    </div>
  )
}

// Stat counter with label
interface StatCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  className?: string
  valueClassName?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export function StatCounter({
  value,
  label,
  prefix,
  suffix,
  className,
  valueClassName,
  trend,
  trendValue,
}: StatCounterProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className={cn("text-2xl font-bold", valueClassName)}>
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-1">{label}</div>
      {trend && trendValue && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-xs mt-1 font-medium",
            trend === "up" && "text-atomic-green",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-[var(--text-secondary)]"
          )}
        >
          {trend === "up" && "+"}{trendValue}
        </motion.div>
      )}
    </div>
  )
}

// Rank position with animation
interface AnimatedRankProps {
  rank: number
  previousRank?: number
  className?: string
}

export function AnimatedRank({
  rank,
  previousRank,
  className,
}: AnimatedRankProps) {
  const change = previousRank ? previousRank - rank : 0
  const isUp = change > 0
  const isDown = change < 0

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("flex items-center gap-1", className)}
    >
      <span className="text-xl font-bold">#{rank}</span>
      {change !== 0 && (
        <motion.span
          initial={{ opacity: 0, x: isUp ? 5 : -5 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "text-xs font-medium",
            isUp && "text-atomic-green",
            isDown && "text-red-500"
          )}
        >
          {isUp && "▲"}{isDown && "▼"}{Math.abs(change)}
        </motion.span>
      )}
    </motion.div>
  )
}

// Win streak counter with fire effect
interface WinStreakProps {
  streak: number
  className?: string
}

export function WinStreak({ streak, className }: WinStreakProps) {
  const isOnFire = streak >= 3
  const isGoldenFire = streak >= 5

  if (streak < 2) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
        isGoldenFire
          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
          : isOnFire
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : "bg-atomic-green/20 text-atomic-green",
        className
      )}
    >
      {isOnFire && (
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {isGoldenFire ? "🔥" : "🔥"}
        </motion.span>
      )}
      <CountUp value={streak} triggerOnView={false} />
      <span>Win</span>
    </motion.div>
  )
}
