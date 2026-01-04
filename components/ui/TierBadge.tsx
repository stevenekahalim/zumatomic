"use client"

import { motion } from "framer-motion"
import { Crown, Star, Shield, Award } from "lucide-react"
import { cn } from "@/lib/utils"

type TierType = "mythic" | "legend" | "epic" | "herald"

interface TierBadgeProps {
  tier: TierType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const tierConfig: Record<
  TierType,
  {
    label: string
    icon: React.ReactNode
    gradient: string
    glow: string
    borderColor: string
    textColor: string
  }
> = {
  mythic: {
    label: "Mythic",
    icon: <Crown className="w-full h-full" />,
    gradient: "from-purple-600 via-pink-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.5)",
    borderColor: "border-purple-500",
    textColor: "text-purple-400",
  },
  legend: {
    label: "Legend",
    icon: <Star className="w-full h-full" />,
    gradient: "from-yellow-500 via-amber-400 to-yellow-500",
    glow: "rgba(251, 191, 36, 0.5)",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-400",
  },
  epic: {
    label: "Epic",
    icon: <Shield className="w-full h-full" />,
    gradient: "from-emerald-500 via-green-400 to-emerald-500",
    glow: "rgba(16, 185, 129, 0.5)",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-400",
  },
  herald: {
    label: "Herald",
    icon: <Award className="w-full h-full" />,
    gradient: "from-slate-500 via-slate-400 to-slate-500",
    glow: "rgba(148, 163, 184, 0.3)",
    borderColor: "border-slate-500",
    textColor: "text-slate-400",
  },
}

const sizes = {
  sm: { badge: "w-5 h-5", icon: "w-3 h-3", text: "text-xs" },
  md: { badge: "w-7 h-7", icon: "w-4 h-4", text: "text-sm" },
  lg: { badge: "w-10 h-10", icon: "w-6 h-6", text: "text-base" },
}

export function TierBadge({
  tier,
  size = "md",
  showLabel = false,
  animated = true,
  className,
}: TierBadgeProps) {
  const config = tierConfig[tier]
  const sizeConfig = sizes[size]

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.div
        className="relative"
        animate={
          animated && (tier === "mythic" || tier === "legend")
            ? {
                scale: [1, 1.05, 1],
              }
            : undefined
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow effect for mythic and legend */}
        {(tier === "mythic" || tier === "legend") && animated && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full blur-md",
              tier === "mythic" ? "bg-purple-500" : "bg-yellow-500"
            )}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Badge */}
        <div
          className={cn(
            "relative rounded-full flex items-center justify-center",
            "bg-gradient-to-br",
            config.gradient,
            sizeConfig.badge
          )}
        >
          <div className={cn("text-white", sizeConfig.icon)}>
            {config.icon}
          </div>
        </div>
      </motion.div>

      {showLabel && (
        <span className={cn("font-semibold", config.textColor, sizeConfig.text)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// Tier card wrapper with glow effect
interface TierCardProps {
  tier: TierType
  children: React.ReactNode
  className?: string
}

export function TierCard({ tier, children, className }: TierCardProps) {
  const config = tierConfig[tier]

  return (
    <div className={cn("relative", className)}>
      {/* Glow background */}
      {(tier === "mythic" || tier === "legend") && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-2xl blur-xl opacity-20",
            tier === "mythic" ? "bg-purple-500" : "bg-yellow-500"
          )}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Card */}
      <div
        className={cn(
          "relative rounded-2xl border bg-dark-card",
          config.borderColor,
          tier === "mythic" && "border-purple-500/50",
          tier === "legend" && "border-yellow-500/50"
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Tier progress bar showing progress to next tier
interface TierProgressProps {
  currentMMR: number
  tier: TierType
  className?: string
}

const tierRanges: Record<TierType, { min: number; max: number; next?: TierType }> = {
  herald: { min: 0, max: 1200, next: "epic" },
  epic: { min: 1200, max: 1500, next: "legend" },
  legend: { min: 1500, max: 1800, next: "mythic" },
  mythic: { min: 1800, max: 2500 },
}

export function TierProgress({ currentMMR, tier, className }: TierProgressProps) {
  const range = tierRanges[tier]
  const config = tierConfig[tier]
  const progress = Math.min(
    100,
    ((currentMMR - range.min) / (range.max - range.min)) * 100
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <TierBadge tier={tier} size="sm" showLabel />
        {range.next && (
          <>
            <div className="flex-1 mx-4 h-px bg-dark-border" />
            <TierBadge tier={range.next} size="sm" showLabel animated={false} />
          </>
        )}
      </div>

      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
        <span>{range.min} MMR</span>
        <span className="font-semibold text-white">{currentMMR} MMR</span>
        <span>{range.max} MMR</span>
      </div>
    </div>
  )
}

// Rank position badge (1st, 2nd, 3rd with special styling)
interface RankBadgeProps {
  rank: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RankBadge({ rank, size = "md", className }: RankBadgeProps) {
  const isTop3 = rank <= 3

  const rankStyles: Record<number, string> = {
    1: "bg-gradient-to-br from-yellow-400 to-amber-600 text-white",
    2: "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
    3: "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
  }

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  }

  return (
    <motion.div
      initial={isTop3 ? { scale: 0, rotate: -180 } : { scale: 0 }}
      animate={{ scale: 1, rotate: 0 }}
      className={cn(
        "rounded-full flex items-center justify-center font-bold",
        isTop3
          ? rankStyles[rank]
          : "bg-dark-border text-[var(--text-secondary)]",
        sizeClasses[size],
        isTop3 && "shadow-lg",
        className
      )}
    >
      {rank <= 3 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow:
              rank === 1
                ? [
                    "0 0 0 0 rgba(251, 191, 36, 0)",
                    "0 0 20px 4px rgba(251, 191, 36, 0.4)",
                    "0 0 0 0 rgba(251, 191, 36, 0)",
                  ]
                : undefined,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
      <span className="relative">{rank}</span>
    </motion.div>
  )
}
