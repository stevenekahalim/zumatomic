"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Target,
  Flame,
  Shield,
  Star,
  Zap,
  Award,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sparkle } from "@/components/animations/Confetti"

type BadgeType =
  | "first_win"
  | "giant_slayer"
  | "streak_master"
  | "defender"
  | "rising_star"
  | "lightning"
  | "champion"
  | "legend"

interface BadgeConfig {
  icon: React.ReactNode
  label: string
  description: string
  gradient: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  first_win: {
    icon: <Trophy className="w-6 h-6" />,
    label: "First Blood",
    description: "Menangkan pertandingan pertama",
    gradient: "from-emerald-500 to-green-600",
    rarity: "common",
  },
  giant_slayer: {
    icon: <Target className="w-6 h-6" />,
    label: "Giant Slayer",
    description: "Kalahkan tim dengan MMR lebih tinggi",
    gradient: "from-red-500 to-orange-600",
    rarity: "rare",
  },
  streak_master: {
    icon: <Flame className="w-6 h-6" />,
    label: "Streak Master",
    description: "5 win streak dalam satu minggu",
    gradient: "from-orange-500 to-red-600",
    rarity: "epic",
  },
  defender: {
    icon: <Shield className="w-6 h-6" />,
    label: "Defender",
    description: "Pertahankan peringkat top 10",
    gradient: "from-blue-500 to-cyan-600",
    rarity: "rare",
  },
  rising_star: {
    icon: <Star className="w-6 h-6" />,
    label: "Rising Star",
    description: "Naik 3 tier dalam sebulan",
    gradient: "from-yellow-500 to-amber-600",
    rarity: "epic",
  },
  lightning: {
    icon: <Zap className="w-6 h-6" />,
    label: "Lightning Fast",
    description: "Menangkan 3-0 dalam waktu singkat",
    gradient: "from-cyan-500 to-blue-600",
    rarity: "rare",
  },
  champion: {
    icon: <Award className="w-6 h-6" />,
    label: "Season Champion",
    description: "Juara musim",
    gradient: "from-purple-500 to-pink-600",
    rarity: "legendary",
  },
  legend: {
    icon: <Crown className="w-6 h-6" />,
    label: "Living Legend",
    description: "Capai tier Mythic",
    gradient: "from-amber-400 to-yellow-500",
    rarity: "legendary",
  },
}

const rarityGlow: Record<string, string> = {
  common: "rgba(16, 185, 129, 0.3)",
  rare: "rgba(59, 130, 246, 0.4)",
  epic: "rgba(168, 85, 247, 0.5)",
  legendary: "rgba(251, 191, 36, 0.6)",
}

interface BadgeProps {
  type: BadgeType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  showTooltip?: boolean
  isNew?: boolean
  isLocked?: boolean
  className?: string
}

const sizes = {
  sm: { badge: "w-10 h-10", icon: "w-5 h-5" },
  md: { badge: "w-14 h-14", icon: "w-7 h-7" },
  lg: { badge: "w-20 h-20", icon: "w-10 h-10" },
}

export function Badge({
  type,
  size = "md",
  showLabel = false,
  showTooltip = false,
  isNew = false,
  isLocked = false,
  className,
}: BadgeProps) {
  const [showTooltipState, setShowTooltipState] = useState(false)
  const config = badgeConfigs[type]
  const sizeConfig = sizes[size]

  return (
    <div className={cn("relative inline-block", className)}>
      <motion.div
        whileHover={!isLocked ? { scale: 1.1 } : undefined}
        whileTap={!isLocked ? { scale: 0.95 } : undefined}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        className="relative"
      >
        {/* Glow effect for rare+ badges */}
        {!isLocked && config.rarity !== "common" && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-xl blur-lg",
              `bg-gradient-to-br ${config.gradient}`
            )}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Badge container */}
        <div
          className={cn(
            "relative rounded-xl flex items-center justify-center",
            sizeConfig.badge,
            isLocked
              ? "bg-dark-border text-[var(--text-secondary)]"
              : `bg-gradient-to-br ${config.gradient} text-white shadow-lg`
          )}
        >
          <div className={sizeConfig.icon}>{config.icon}</div>

          {/* Lock overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/50 rounded-xl">
              <svg
                className="w-4 h-4 text-[var(--text-secondary)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Sparkle for legendary */}
          {!isLocked && config.rarity === "legendary" && (
            <Sparkle isActive className="scale-150" />
          )}
        </div>

        {/* New indicator */}
        {isNew && !isLocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-[8px] font-bold text-white">!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      {showLabel && (
        <p
          className={cn(
            "text-center mt-2 text-xs font-medium",
            isLocked ? "text-[var(--text-secondary)]" : "text-white"
          )}
        >
          {config.label}
        </p>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-dark-card border border-dark-border rounded-xl shadow-xl whitespace-nowrap"
          >
            <p className="font-semibold text-sm">{config.label}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {config.description}
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-dark-card border-r border-b border-dark-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Badge showcase grid
interface BadgeShowcaseProps {
  badges: Array<{
    type: BadgeType
    isNew?: boolean
    isLocked?: boolean
  }>
  className?: string
}

export function BadgeShowcase({ badges, className }: BadgeShowcaseProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.type}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Badge
            type={badge.type}
            size="md"
            showLabel
            showTooltip
            isNew={badge.isNew}
            isLocked={badge.isLocked}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Badge unlock animation modal
interface BadgeUnlockModalProps {
  isOpen: boolean
  onClose: () => void
  badgeType: BadgeType
}

export function BadgeUnlockModal({
  isOpen,
  onClose,
  badgeType,
}: BadgeUnlockModalProps) {
  const config = badgeConfigs[badgeType]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Badge with glow */}
            <div className="relative mx-auto mb-6 w-24 h-24">
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-2xl blur-2xl",
                  `bg-gradient-to-br ${config.gradient}`
                )}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <div
                className={cn(
                  "relative w-full h-full rounded-2xl flex items-center justify-center text-white",
                  `bg-gradient-to-br ${config.gradient}`
                )}
              >
                <div className="w-12 h-12">{config.icon}</div>
              </div>
              <Sparkle isActive />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold gradient-text mb-2"
            >
              Badge Unlocked!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-semibold mb-2"
            >
              {config.label}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[var(--text-secondary)] mb-6"
            >
              {config.description}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3 bg-atomic-purple rounded-xl font-semibold hover:bg-opacity-80 transition-colors"
            >
              Mantap!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
