"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, X } from "lucide-react"
import { BADGES, BadgeName } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface Achievement {
  badge: BadgeName
  unlockedAt: string
}

interface AchievementsSectionProps {
  achievements: Achievement[]
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeName | null>(null)

  const allBadgeNames = Object.keys(BADGES) as BadgeName[]
  const unlockedBadges = new Set(achievements.map(a => a.badge))

  const getUnlockDate = (badge: BadgeName) => {
    const achievement = achievements.find(a => a.badge === badge)
    if (!achievement) return null
    return new Date(achievement.unlockedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <div className="mb-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[var(--tier-legend)]" />
            <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">
              Achievements
            </h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            {achievements.length}/{allBadgeNames.length} Unlocked
          </span>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-5 gap-3">
          {allBadgeNames.map((badgeName, index) => {
            const badge = BADGES[badgeName]
            const isUnlocked = unlockedBadges.has(badgeName)

            return (
              <motion.button
                key={badgeName}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBadge(badgeName)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 p-2 transition-all",
                  isUnlocked
                    ? "glass-card hover:bg-white/10"
                    : "bg-white/5 opacity-40"
                )}
              >
                <span className={cn(
                  "text-2xl",
                  !isUnlocked && "grayscale"
                )}>
                  {isUnlocked ? badge.emoji : "?"}
                </span>
                <span className={cn(
                  "text-[9px] font-medium truncate w-full text-center",
                  isUnlocked ? "text-white" : "text-[var(--text-tertiary)]"
                )}>
                  {isUnlocked ? badge.name.split(' ')[0] : "???"}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            >
              <div className="glass-card rounded-2xl p-6 text-center">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {/* Badge Icon */}
                <div className={cn(
                  "w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl",
                  unlockedBadges.has(selectedBadge)
                    ? "bg-[var(--tier-legend)]/20"
                    : "bg-white/10 grayscale"
                )}>
                  {unlockedBadges.has(selectedBadge)
                    ? BADGES[selectedBadge].emoji
                    : "🔒"
                  }
                </div>

                {/* Badge Name */}
                <h3 className="text-xl font-bold mb-1">
                  {BADGES[selectedBadge].name}
                </h3>

                {/* Badge Description */}
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {BADGES[selectedBadge].description}
                </p>

                {/* Unlock Status */}
                {unlockedBadges.has(selectedBadge) ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-toxic)]/20 text-[var(--color-toxic)] text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-toxic)]" />
                    Unlocked {getUnlockDate(selectedBadge)}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[var(--text-secondary)] text-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]" />
                    Not yet unlocked
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
