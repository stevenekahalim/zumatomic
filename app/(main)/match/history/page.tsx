"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Filter, ChevronDown, Swords } from "lucide-react"
import { BottomSheet } from "@/components/ui/BottomSheet"
import { EmptyState } from "@/components/ui/EmptyState"
import { MatchResultCard, MatchResultData } from "@/components/shared/MatchResultCard"
import matchesData from "@/data/mock/matches.json"

type FilterType = "all" | "win" | "lose" | "league" | "ranked"

export default function MatchHistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>("all")
  const [showFilterSheet, setShowFilterSheet] = useState(false)

  const allMatches = matchesData as MatchResultData[]

  // Filter matches based on current filter
  const filteredMatches = allMatches.filter((match) => {
    if (filter === "all") return true
    if (filter === "win") return match.winner === "A" // Assuming user is on team A
    if (filter === "lose") return match.winner === "B"
    if (filter === "league") return match.type === "LEAGUE"
    if (filter === "ranked") return match.type === "RANKED"
    return true
  })

  // Calculate stats (assuming user is on team A for demo)
  const stats = {
    total: allMatches.length,
    wins: allMatches.filter((m) => m.winner === "A").length,
    losses: allMatches.filter((m) => m.winner === "B").length,
    winRate: Math.round(
      (allMatches.filter((m) => m.winner === "A").length / allMatches.length) * 100
    ),
  }

  const filterLabels: Record<FilterType, string> = {
    all: "All Matches",
    win: "Wins",
    lose: "Losses",
    league: "League",
    ranked: "Ranked",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[var(--bg-secondary)] pb-safe"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 glass-elevated border-b border-[var(--border-light)]">
        <div className="flex items-center gap-4 p-4 max-w-[var(--content-max-width)] mx-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors"
          >
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </motion.button>
          <h1 className="flex-1 text-lg font-bold text-[var(--text-primary)]">Match History</h1>
        </div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 max-w-[var(--content-max-width)] mx-auto"
      >
        <div className="glass-card rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Matches</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
              <p className="text-xs text-[var(--text-secondary)]">Wins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
              <p className="text-xs text-[var(--text-secondary)]">Losses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)]">{stats.winRate}%</p>
              <p className="text-xs text-[var(--text-secondary)]">Win Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="px-4 mb-4 flex items-center justify-between max-w-[var(--content-max-width)] mx-auto">
        <h2 className="font-semibold text-[var(--text-primary)]">Matches</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilterSheet(true)}
          className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg text-sm text-[var(--text-primary)]"
        >
          <Filter className="w-4 h-4" />
          <span>{filterLabels[filter]}</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Match List */}
      <div className="px-4 space-y-3 max-w-[var(--content-max-width)] mx-auto pb-6">
        {filteredMatches.length === 0 ? (
          <EmptyState
            type="matches"
            title="No Matches Found"
            message={`No ${filter === "all" ? "" : filterLabels[filter].toLowerCase()} matches found.`}
          />
        ) : (
          filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MatchResultCard
                match={match}
                onClick={() => console.log("Match clicked:", match.id)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Matches"
      >
        <div className="p-4 space-y-2">
          {(["all", "win", "lose", "league", "ranked"] as FilterType[]).map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFilter(type)
                setShowFilterSheet(false)
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                filter === type
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                  : "border-[var(--border-light)] hover:bg-[var(--bg-input)]"
              }`}
            >
              <div className="flex items-center gap-3">
                {type === "league" ? (
                  <Trophy size={18} className="text-[var(--tier-legend)]" />
                ) : type === "ranked" ? (
                  <Swords size={18} className="text-[var(--color-primary)]" />
                ) : null}
                <span className="font-medium text-[var(--text-primary)]">{filterLabels[type]}</span>
              </div>
              {filter === type && (
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </BottomSheet>
    </motion.div>
  )
}
