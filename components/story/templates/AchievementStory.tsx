"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Trophy, Crown, Flame, Star, Target, Medal } from "lucide-react"
import { StoryCanvas, StoryHeader } from "../StoryCanvas"
import { cn } from "@/lib/utils"

type AchievementType =
  | "rank_up"
  | "win_streak"
  | "first_win"
  | "giant_slayer"
  | "season_champion"

interface AchievementStoryProps {
  type: AchievementType
  playerName: string
  teamName: string
  avatar: string
  value?: string | number
  date?: string
}

const achievementConfig: Record<
  AchievementType,
  {
    icon: React.ReactNode
    title: string
    subtitle: string
    gradient: string
    bgVariant: "celebration" | "achievement" | "default"
  }
> = {
  rank_up: {
    icon: <TrendingUp className="w-12 h-12" />,
    title: "RANK UP!",
    subtitle: "Naik ke tier baru",
    gradient: "from-atomic-purple to-atomic-pink",
    bgVariant: "celebration",
  },
  win_streak: {
    icon: <Flame className="w-12 h-12" />,
    title: "ON FIRE!",
    subtitle: "Win Streak",
    gradient: "from-orange-500 to-red-500",
    bgVariant: "achievement",
  },
  first_win: {
    icon: <Trophy className="w-12 h-12" />,
    title: "FIRST WIN!",
    subtitle: "Kemenangan pertama",
    gradient: "from-atomic-green to-emerald-500",
    bgVariant: "celebration",
  },
  giant_slayer: {
    icon: <Target className="w-12 h-12" />,
    title: "GIANT SLAYER!",
    subtitle: "Mengalahkan tim dengan MMR lebih tinggi",
    gradient: "from-atomic-cyan to-blue-500",
    bgVariant: "achievement",
  },
  season_champion: {
    icon: <Crown className="w-12 h-12" />,
    title: "SEASON CHAMPION!",
    subtitle: "Juara Musim",
    gradient: "from-atomic-yellow to-orange-500",
    bgVariant: "achievement",
  },
}

// Standalone TrendingUp component since we need it
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

export const AchievementStory = forwardRef<HTMLDivElement, AchievementStoryProps>(
  ({ type, playerName, teamName, avatar, value, date }, ref) => {
    const config = achievementConfig[type]

    return (
      <StoryCanvas ref={ref} variant={config.bgVariant}>
        {/* Header */}
        <StoryHeader date={date} />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Achievement badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative mb-8"
          >
            {/* Glow */}
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-3xl opacity-50 scale-150",
                `bg-gradient-to-br ${config.gradient}`
              )}
            />

            {/* Badge */}
            <div
              className={cn(
                "relative w-28 h-28 rounded-3xl flex items-center justify-center",
                "bg-gradient-to-br shadow-2xl",
                config.gradient
              )}
            >
              {config.icon}
            </div>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 60],
                  y: [0, (Math.random() - 0.5) * 60],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white"
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-3xl font-black text-center mb-2",
              "bg-gradient-to-r bg-clip-text text-transparent",
              config.gradient
            )}
          >
            {config.title}
          </motion.h1>

          {/* Value (if applicable) */}
          {value && (
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-black text-white mb-4"
            >
              {value}
            </motion.p>
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[var(--text-secondary)] text-center mb-8"
          >
            {config.subtitle}
          </motion.p>

          {/* Team info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 px-6 py-4 bg-dark-card/50 backdrop-blur-sm rounded-2xl border border-dark-border/50"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-2xl">
              {avatar}
            </div>
            <div>
              <p className="font-bold">{playerName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{teamName}</p>
            </div>
          </motion.div>
        </div>
      </StoryCanvas>
    )
  }
)

AchievementStory.displayName = "AchievementStory"
