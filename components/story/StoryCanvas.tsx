"use client"

import { forwardRef, ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StoryCanvasProps {
  children: ReactNode
  className?: string
  variant?: "default" | "celebration" | "achievement"
}

export const StoryCanvas = forwardRef<HTMLDivElement, StoryCanvasProps>(
  ({ children, className, variant = "default" }, ref) => {
    const backgrounds = {
      default:
        "bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#0F0F1A]",
      celebration:
        "bg-gradient-to-br from-atomic-purple/20 via-[#0F0F1A] to-atomic-pink/20",
      achievement:
        "bg-gradient-to-br from-atomic-yellow/20 via-[#0F0F1A] to-orange-500/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-[360px] h-[640px] overflow-hidden",
          backgrounds[variant],
          className
        )}
        style={{
          // Story aspect ratio (9:16)
          aspectRatio: "9/16",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-atomic-purple/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-atomic-pink/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-atomic-cyan/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>

        {/* ZUMATOMIC Watermark */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-bg/50 backdrop-blur-sm rounded-full border border-dark-border/50">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-[10px] font-black">
              Z
            </div>
            <span className="text-xs font-semibold gradient-text">ZUMATOMIC</span>
          </div>
        </div>
      </div>
    )
  }
)

StoryCanvas.displayName = "StoryCanvas"

// Story header component
interface StoryHeaderProps {
  date?: string
  season?: string
}

export function StoryHeader({ date, season }: StoryHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="text-xs text-[var(--text-secondary)]">
        {date || new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
      {season && (
        <div className="px-2 py-1 bg-atomic-purple/20 rounded-full text-xs text-atomic-purple font-medium">
          {season}
        </div>
      )}
    </div>
  )
}

// Team display for story
interface StoryTeamProps {
  name: string
  avatar: string
  isWinner?: boolean
  className?: string
}

export function StoryTeam({ name, avatar, isWinner, className }: StoryTeamProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("text-center", className)}
    >
      <div
        className={cn(
          "w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center text-4xl",
          "bg-gradient-to-br shadow-lg",
          isWinner
            ? "from-atomic-green/30 to-emerald-500/30 ring-2 ring-atomic-green"
            : "from-dark-card to-dark-border"
        )}
      >
        {avatar}
      </div>
      <h3 className="font-bold text-sm">{name}</h3>
      {isWinner && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block mt-1 px-2 py-0.5 bg-atomic-green text-[10px] font-bold rounded-full"
        >
          WINNER
        </motion.span>
      )}
    </motion.div>
  )
}

// Score display for story
interface StoryScoreProps {
  home: number
  away: number
  isHomeWinner: boolean
}

export function StoryScore({ home, away, isHomeWinner }: StoryScoreProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-6xl font-black",
          isHomeWinner ? "text-atomic-green" : "text-white"
        )}
      >
        {home}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl text-[var(--text-secondary)]"
      >
        -
      </motion.span>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "text-6xl font-black",
          !isHomeWinner ? "text-atomic-green" : "text-white"
        )}
      >
        {away}
      </motion.span>
    </div>
  )
}

// MMR change display
interface StoryMMRChangeProps {
  change: number
}

export function StoryMMRChange({ change }: StoryMMRChangeProps) {
  const isPositive = change > 0

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-center"
    >
      <span
        className={cn(
          "text-2xl font-bold",
          isPositive ? "text-atomic-green" : "text-red-500"
        )}
      >
        {isPositive ? "+" : ""}
        {change} MMR
      </span>
    </motion.div>
  )
}
