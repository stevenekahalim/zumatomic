"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Trophy, Flame, TrendingUp } from "lucide-react"
import {
  StoryCanvas,
  StoryHeader,
  StoryTeam,
  StoryScore,
  StoryMMRChange,
} from "../StoryCanvas"

interface MatchResultStoryProps {
  homeTeam: {
    name: string
    avatar: string
    players: string[]
  }
  awayTeam: {
    name: string
    avatar: string
    players: string[]
  }
  score: {
    home: number
    away: number
  }
  mmrChange: number
  isWinner: boolean
  winStreak?: number
  date?: string
}

export const MatchResultStory = forwardRef<HTMLDivElement, MatchResultStoryProps>(
  (
    { homeTeam, awayTeam, score, mmrChange, isWinner, winStreak, date },
    ref
  ) => {
    const isHomeWinner = score.home > score.away

    return (
      <StoryCanvas
        ref={ref}
        variant={isWinner ? "celebration" : "default"}
      >
        {/* Header */}
        <StoryHeader date={date} season="Season 1" />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 mb-8"
        >
          {isWinner ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-atomic-green" />
              <h1 className="text-2xl font-black gradient-text">VICTORY!</h1>
              <Trophy className="w-6 h-6 text-atomic-green" />
            </div>
          ) : (
            <h1 className="text-2xl font-black text-[var(--text-secondary)]">
              MATCH RESULT
            </h1>
          )}
        </motion.div>

        {/* Teams and score */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full flex items-start justify-between mb-8">
            <StoryTeam
              name={homeTeam.name}
              avatar={homeTeam.avatar}
              isWinner={isHomeWinner}
            />
            <StoryTeam
              name={awayTeam.name}
              avatar={awayTeam.avatar}
              isWinner={!isHomeWinner}
            />
          </div>

          <StoryScore
            home={score.home}
            away={score.away}
            isHomeWinner={isHomeWinner}
          />

          <div className="mt-8">
            <StoryMMRChange change={mmrChange} />
          </div>

          {/* Win streak badge */}
          {winStreak && winStreak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            >
              <Flame className="w-5 h-5" />
              <span className="font-bold">{winStreak} WIN STREAK!</span>
              <Flame className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        {/* Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-4 pb-16"
        >
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-3 border border-dark-border/50">
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <p className="text-[var(--text-secondary)] mb-1">{homeTeam.name}</p>
                <p className="font-medium">{homeTeam.players.join(" & ")}</p>
              </div>
              <div className="text-[var(--text-secondary)]">vs</div>
              <div className="text-center">
                <p className="text-[var(--text-secondary)] mb-1">{awayTeam.name}</p>
                <p className="font-medium">{awayTeam.players.join(" & ")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </StoryCanvas>
    )
  }
)

MatchResultStory.displayName = "MatchResultStory"
