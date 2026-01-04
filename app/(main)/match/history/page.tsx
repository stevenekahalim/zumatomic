"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Trophy,
  X as XIcon,
  Clock,
  Filter,
  ChevronDown,
  Share2,
  Calendar,
} from "lucide-react"
import { IconButton } from "@/components/ui/RippleButton"
import { BottomSheet } from "@/components/ui/BottomSheet"
import { EmptyState } from "@/components/ui/EmptyState"
import { pageVariants, staggerItemVariants } from "@/lib/animations"
import { StaggerList } from "@/components/animations/StaggerList"

// Mock match history data
const mockHistory = [
  {
    id: "match-001",
    date: "Hari ini",
    opponent: { name: "Beta Force", avatar: "🏆" },
    score: { home: 3, away: 1 },
    result: "win" as const,
    mmrChange: 28,
    status: "verified" as const,
  },
  {
    id: "match-002",
    date: "Kemarin",
    opponent: { name: "Gamma Squad", avatar: "⚡" },
    score: { home: 2, away: 3 },
    result: "lose" as const,
    mmrChange: -25,
    status: "verified" as const,
  },
  {
    id: "match-003",
    date: "2 hari lalu",
    opponent: { name: "Delta Team", avatar: "🔥" },
    score: { home: 3, away: 2 },
    result: "win" as const,
    mmrChange: 30,
    status: "verified" as const,
  },
  {
    id: "match-004",
    date: "3 hari lalu",
    opponent: { name: "Epsilon Unit", avatar: "💜" },
    score: { home: 3, away: 0 },
    result: "win" as const,
    mmrChange: 22,
    status: "verified" as const,
  },
  {
    id: "match-005",
    date: "5 hari lalu",
    opponent: { name: "Zeta Force", avatar: "🌟" },
    score: { home: 1, away: 3 },
    result: "lose" as const,
    mmrChange: -28,
    status: "verified" as const,
  },
  {
    id: "match-006",
    date: "1 minggu lalu",
    opponent: { name: "Theta Squad", avatar: "🎯" },
    score: { home: 3, away: 2 },
    result: "win" as const,
    mmrChange: 26,
    status: "verified" as const,
  },
]

type FilterType = "all" | "win" | "lose"

export default function MatchHistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>("all")
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const filteredHistory = mockHistory.filter((match) => {
    if (filter === "all") return true
    return match.result === filter
  })

  const stats = {
    total: mockHistory.length,
    wins: mockHistory.filter((m) => m.result === "win").length,
    losses: mockHistory.filter((m) => m.result === "lose").length,
    winRate: Math.round(
      (mockHistory.filter((m) => m.result === "win").length / mockHistory.length) * 100
    ),
  }

  const filterLabels: Record<FilterType, string> = {
    all: "Semua",
    win: "Menang",
    lose: "Kalah",
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen bg-dark-bg pb-safe"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
        <div className="flex items-center gap-4 p-4">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            aria-label="Kembali"
            onClick={() => router.back()}
            variant="ghost"
          />
          <h1 className="flex-1 text-lg font-bold">Riwayat Pertandingan</h1>
          <IconButton
            icon={<Share2 className="w-5 h-5" />}
            aria-label="Share"
            variant="ghost"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Match</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-atomic-green">{stats.wins}</p>
              <p className="text-xs text-[var(--text-secondary)]">Menang</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
              <p className="text-xs text-[var(--text-secondary)]">Kalah</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-atomic-purple">{stats.winRate}%</p>
              <p className="text-xs text-[var(--text-secondary)]">Win Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Pertandingan</h2>
        <button
          onClick={() => setShowFilterSheet(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-dark-border rounded-lg text-sm"
        >
          <Filter className="w-4 h-4" />
          <span>{filterLabels[filter]}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Match List */}
      <div className="px-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <EmptyState
            type="matches"
            title="Tidak Ada Pertandingan"
            message={`Belum ada pertandingan yang ${filter === "win" ? "dimenangkan" : filter === "lose" ? "dikalahkan" : "tercatat"}.`}
          />
        ) : (
          <StaggerList className="space-y-3">
            {filteredHistory.map((match) => (
              <motion.div
                key={match.id}
                layout
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedMatch(expandedMatch === match.id ? null : match.id)
                  }
                  className="w-full p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Result icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        match.result === "win"
                          ? "bg-atomic-green/20 text-atomic-green"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {match.result === "win" ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <XIcon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Opponent */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.opponent.avatar}</span>
                        <span className="font-medium">{match.opponent.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{match.date}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-lg font-bold">
                        <span
                          className={
                            match.score.home > match.score.away
                              ? "text-atomic-green"
                              : ""
                          }
                        >
                          {match.score.home}
                        </span>
                        <span className="text-[var(--text-secondary)]">-</span>
                        <span
                          className={
                            match.score.away > match.score.home
                              ? "text-atomic-green"
                              : ""
                          }
                        >
                          {match.score.away}
                        </span>
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          match.mmrChange > 0
                            ? "text-atomic-green"
                            : "text-red-500"
                        }`}
                      >
                        {match.mmrChange > 0 ? "+" : ""}
                        {match.mmrChange} MMR
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedMatch === match.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-dark-border"
                    >
                      <div className="p-4 flex gap-2">
                        <button className="flex-1 py-2 bg-dark-border rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors">
                          Lihat Detail
                        </button>
                        <button className="flex-1 py-2 bg-atomic-purple rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors">
                          Buat Story
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </StaggerList>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        title="Filter Pertandingan"
      >
        <div className="p-4 space-y-2">
          {(["all", "win", "lose"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilter(type)
                setShowFilterSheet(false)
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                filter === type
                  ? "border-atomic-purple bg-atomic-purple/10"
                  : "border-dark-border hover:bg-dark-border/50"
              }`}
            >
              <span className="font-medium">{filterLabels[type]}</span>
              {filter === type && (
                <div className="w-5 h-5 rounded-full bg-atomic-purple flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Trophy className="w-3 h-3" />
                  </motion.div>
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </motion.div>
  )
}
