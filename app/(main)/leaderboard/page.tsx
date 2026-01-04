"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { TeamCard, TeamCardSkeleton } from "@/components/leaderboard/TeamCard"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { TierName, TIERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import teamsData from "@/data/mock/teams.json"
import seasonData from "@/data/mock/season.json"
import { Team } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

type FilterType = "all" | "open" | TierName

const filterTabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "open", label: "Open Sparring" },
  { value: "MYTHIC", label: "Mythic" },
  { value: "LEGEND", label: "Legend" },
  { value: "EPIC", label: "Epic" },
  { value: "HERALD", label: "Herald" },
]

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [isLoading] = useState(false)

  const teams = teamsData as Team[]
  const season = seasonData

  const filteredTeams = useMemo(() => {
    let result = [...teams]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.captain.name.toLowerCase().includes(query) ||
          team.partner.name.toLowerCase().includes(query)
      )
    }

    if (activeFilter === "open") {
      result = result.filter((team) => team.isOpenSparring)
    } else if (activeFilter !== "all") {
      result = result.filter((team) => team.tier === activeFilter)
    }

    result.sort((a, b) => a.rank - b.rank)
    return result
  }, [teams, searchQuery, activeFilter])

  const teamsByTier = useMemo(() => {
    const groups: Record<TierName, Team[]> = {
      MYTHIC: [],
      LEGEND: [],
      EPIC: [],
      HERALD: [],
    }

    filteredTeams.forEach((team) => {
      groups[team.tier].push(team)
    })

    return groups
  }, [filteredTeams])

  return (
    <div className="min-h-screen pb-safe">
      {/* Sticky Header - Liquid Smoke Material */}
      <div className="sticky top-[var(--header-height)] z-30 glass-elevated">
        <div
          className="max-w-[var(--content-max-width)] mx-auto py-4"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-display text-[20px]">Klasemen</h1>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {season.name} • {teams.length} Tim
              </p>
            </div>
            <button
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Filter"
            >
              <SlidersHorizontal size={18} className="text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder="Cari tim atau pemain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11 pr-11"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X size={14} className="text-[var(--text-secondary)]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Tabs - Horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0",
                  activeFilter === tab.value
                    ? "bg-[var(--color-toxic)] text-[var(--bg-void)]"
                    : "glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team List */}
      <div
        className="max-w-[var(--content-max-width)] mx-auto py-4"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[var(--text-tertiary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-2">
              Tidak ada tim ditemukan
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveFilter("all")
              }}
              className="text-[14px] text-[var(--color-toxic)] font-medium"
            >
              Reset filter
            </button>
          </div>
        ) : activeFilter === "all" && !searchQuery ? (
          // Grouped by tier
          <div className="space-y-8">
            {(Object.keys(TIERS) as TierName[]).map((tier) => {
              const tierTeams = teamsByTier[tier]
              if (tierTeams.length === 0) return null

              return (
                <div key={tier}>
                  {/* Tier Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <TierBadge tier={tier} size="sm" />
                    <span className="text-[13px] text-[var(--text-secondary)]">
                      {TIERS[tier].description}
                    </span>
                  </div>

                  {/* Teams in this tier */}
                  <div className="space-y-2.5">
                    {tierTeams.map((team, index) => (
                      <TeamCard key={team.id} team={team} index={index} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Flat list when filtered
          <div className="space-y-2.5">
            {filteredTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
