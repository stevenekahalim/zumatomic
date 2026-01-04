"use client"

import Link from "next/link"
import { Team } from "@/types"
import { TIERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { TierBadge } from "./TierBadge"
import { OpenSparringIndicator } from "./OpenSparringIndicator"
import { ChevronRight, Flame } from "lucide-react"
import { motion } from "framer-motion"

interface TeamCardProps {
  team: Team
  showRank?: boolean
  compact?: boolean
  className?: string
  index?: number
}

export function TeamCard({
  team,
  showRank = true,
  compact = false,
  className,
  index = 0,
}: TeamCardProps) {
  const tierConfig = TIERS[team.tier]
  const isOnFire = team.winStreak >= 3
  const isTop3 = team.rank <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/team/${team.id}`}
        className={cn(
          "block glass-card p-4",
          team.tier === "MYTHIC" && "border-[var(--tier-mythic)]/30 tier-mythic-glow",
          team.tier === "LEGEND" && "border-[var(--tier-legend)]/20",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          {showRank && (
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[15px] flex-shrink-0",
                isTop3
                  ? cn(
                      "text-[var(--bg-void)]",
                      team.rank === 1 && "bg-[var(--tier-legend)]",
                      team.rank === 2 && "bg-[var(--tier-herald)]",
                      team.rank === 3 && "bg-amber-700"
                    )
                  : "bg-white/5 border border-white/10 text-[var(--text-secondary)]"
              )}
            >
              {team.rank}
            </div>
          )}

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-title text-[15px] truncate">{team.name}</h3>
              {isOnFire && (
                <span className="flex items-center gap-0.5 text-orange-500 flex-shrink-0">
                  <Flame size={14} className="animate-flicker" />
                </span>
              )}
              <OpenSparringIndicator isOpen={team.isOpenSparring} size="sm" />
            </div>

            {!compact && (
              <p className="text-[13px] text-[var(--text-secondary)] truncate">
                {team.captain.name} & {team.partner.name}
              </p>
            )}
          </div>

          {/* MMR & Tier */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-data text-[15px]">{team.mmr}</p>
              <TierBadge tier={team.tier} size="sm" showLabel={false} />
            </div>
            <ChevronRight size={18} className="text-[var(--text-tertiary)]" />
          </div>
        </div>

        {/* Win Streak indicator - only show if > 0 */}
        {team.winStreak > 0 && !compact && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
              Win Streak
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(team.winStreak, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    i < 3 ? "bg-[var(--color-toxic)]" : "bg-orange-500"
                  )}
                />
              ))}
              {team.winStreak > 5 && (
                <span className="text-[11px] text-[var(--color-toxic)] font-medium ml-1">
                  +{team.winStreak - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}

// Skeleton for loading state
export function TeamCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 shimmer" />
        <div className="flex-1">
          <div className="h-4 w-28 bg-white/5 rounded-lg shimmer mb-2" />
          <div className="h-3 w-40 bg-white/5 rounded-lg shimmer" />
        </div>
        <div className="text-right">
          <div className="h-4 w-10 bg-white/5 rounded-lg shimmer mb-1 ml-auto" />
          <div className="h-5 w-5 bg-white/5 rounded-full shimmer ml-auto" />
        </div>
      </div>
    </div>
  )
}
