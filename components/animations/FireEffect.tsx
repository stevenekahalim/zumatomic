"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FireEffectProps {
  size?: "sm" | "md" | "lg"
  intensity?: 1 | 2 | 3 | 4 | 5
  className?: string
}

const sizes = {
  sm: { width: 20, height: 24 },
  md: { width: 28, height: 32 },
  lg: { width: 36, height: 42 },
}

export function FireEffect({
  size = "md",
  intensity = 3,
  className,
}: FireEffectProps) {
  const { width, height } = sizes[size]
  const isGolden = intensity >= 5

  return (
    <div
      className={cn("relative", className)}
      style={{ width, height }}
    >
      {/* Main flame */}
      <motion.div
        animate={{
          scaleY: [1, 1.1, 0.95, 1.05, 1],
          scaleX: [1, 0.95, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full",
          "origin-bottom",
          isGolden
            ? "bg-gradient-to-t from-yellow-500 via-orange-400 to-yellow-300"
            : "bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"
        )}
        style={{
          width: width * 0.7,
          height: height * 0.8,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          filter: `blur(${size === "sm" ? 1 : 2}px)`,
        }}
      />

      {/* Inner bright core */}
      <motion.div
        animate={{
          scaleY: [1, 0.9, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2",
          "origin-bottom",
          isGolden
            ? "bg-gradient-to-t from-yellow-300 to-white"
            : "bg-gradient-to-t from-yellow-400 to-white"
        )}
        style={{
          width: width * 0.4,
          height: height * 0.5,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          filter: "blur(1px)",
        }}
      />

      {/* Additional flames for higher intensity */}
      {intensity >= 3 && (
        <>
          {/* Left flame */}
          <motion.div
            animate={{
              scaleY: [0.8, 1, 0.9, 1],
              rotate: [-5, -10, -5],
            }}
            transition={{
              duration: 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute bottom-0 origin-bottom",
              isGolden
                ? "bg-gradient-to-t from-orange-500 to-yellow-400"
                : "bg-gradient-to-t from-orange-600 to-yellow-500"
            )}
            style={{
              left: "15%",
              width: width * 0.35,
              height: height * 0.55,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              filter: "blur(1px)",
            }}
          />

          {/* Right flame */}
          <motion.div
            animate={{
              scaleY: [0.9, 0.8, 1, 0.9],
              rotate: [5, 10, 5],
            }}
            transition={{
              duration: 0.38,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute bottom-0 origin-bottom",
              isGolden
                ? "bg-gradient-to-t from-orange-500 to-yellow-400"
                : "bg-gradient-to-t from-orange-600 to-yellow-500"
            )}
            style={{
              right: "15%",
              width: width * 0.35,
              height: height * 0.55,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              filter: "blur(1px)",
            }}
          />
        </>
      )}

      {/* Glow effect */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full",
          isGolden
            ? "bg-yellow-500/40"
            : "bg-orange-500/30"
        )}
        style={{
          width: width * 1.5,
          height: height * 0.8,
          filter: "blur(8px)",
        }}
      />
    </div>
  )
}

// On Fire badge (shows when player has a win streak)
interface OnFireBadgeProps {
  streak: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

export function OnFireBadge({
  streak,
  size = "md",
  showCount = true,
  className,
}: OnFireBadgeProps) {
  if (streak < 2) return null

  const intensity = Math.min(5, Math.ceil(streak / 2)) as 1 | 2 | 3 | 4 | 5
  const isGolden = streak >= 5

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full",
        isGolden
          ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30"
          : "bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30",
        className
      )}
    >
      <FireEffect size={size} intensity={intensity} />
      {showCount && (
        <span
          className={cn(
            "font-bold text-sm",
            isGolden ? "text-yellow-400" : "text-orange-400"
          )}
        >
          {streak}
        </span>
      )}
    </motion.div>
  )
}

// Animated hot indicator for featured items
interface HotIndicatorProps {
  className?: string
}

export function HotIndicator({ className }: HotIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "bg-gradient-to-r from-red-600 to-orange-500",
        "text-xs font-bold text-white",
        className
      )}
    >
      <FireEffect size="sm" intensity={3} />
      <span>HOT</span>
    </motion.div>
  )
}

// Tier glow effects based on rank
interface TierGlowProps {
  tier: "mythic" | "legend" | "epic" | "herald"
  children: React.ReactNode
  className?: string
}

export function TierGlow({ tier, children, className }: TierGlowProps) {
  const glowColors = {
    mythic: "from-atomic-purple/30 to-atomic-pink/30",
    legend: "from-yellow-500/30 to-orange-500/30",
    epic: "from-atomic-green/30 to-emerald-500/30",
    herald: "from-slate-400/20 to-slate-500/20",
  }

  const borderColors = {
    mythic: "border-atomic-purple/50",
    legend: "border-yellow-500/50",
    epic: "border-atomic-green/50",
    herald: "border-slate-400/30",
  }

  return (
    <div className={cn("relative", className)}>
      {/* Animated glow background */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br blur-xl",
          glowColors[tier]
        )}
      />

      {/* Content with border */}
      <div
        className={cn(
          "relative rounded-2xl border",
          borderColors[tier]
        )}
      >
        {children}
      </div>

      {/* Mythic tier gets particles */}
      {tier === "mythic" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30],
                x: [0, (Math.random() - 0.5) * 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute bottom-0 w-1 h-1 rounded-full bg-atomic-purple"
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
