"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, X, Calendar, Clock, Trophy, Plus } from "lucide-react"
import { TeamCard, TeamCardSkeleton } from "@/components/leaderboard/TeamCard"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { TierName, TIERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import teamsData from "@/data/mock/teams.json"
import seasonData from "@/data/mock/season.json"
import { Team } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { LeagueMatchModal } from "@/components/match/LeagueMatchModal"

type FilterType = "all" | "open" | TierName

const filterTabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "open", label: "Open Sparring" },
  { value: "MYTHIC", label: "Mythic" },
  { value: "LEGEND", label: "Legend" },
  { value: "EPIC", label: "Epic" },
  { value: "HERALD", label: "Herald" },
]

// Calculate days remaining in season
function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function LeaguePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [isLoading] = useState(false)
  const [showLeagueMatchModal, setShowLeagueMatchModal] = useState(false)

  const teams = teamsData as Team[]
  const season = seasonData
  const daysRemaining = getDaysRemaining(season.endDate)

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
      {/* Season Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-forest) 0%, var(--bg-void) 100%)',
          paddingTop: 'calc(var(--header-height) + 16px)',
          paddingBottom: '24px',
          marginTop: 'calc(-1 * var(--header-height))'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--color-toxic)]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[var(--tier-mythic)]/10 blur-2xl" />

        <div
          className="max-w-[var(--content-max-width)] mx-auto relative z-10"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          {/* Season Info */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-toxic)] text-sm font-semibold uppercase tracking-wider">
                  Liga Aktif
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-toxic)] animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold mb-1">{season.name}</h1>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(season.startDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} - {new Date(season.endDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-right">
              <div className="glass-card px-4 py-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-[var(--color-toxic)] mb-1">
                  <Clock size={14} />
                  <span className="text-xs font-medium">Berakhir dalam</span>
                </div>
                <p className="text-2xl font-bold font-mono">{daysRemaining}</p>
                <p className="text-xs text-[var(--text-secondary)]">hari</p>
              </div>
            </div>
          </div>

          {/* Season Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">{teams.length}</p>
              <p className="text-xs text-[var(--text-secondary)]">Tim</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[var(--tier-mythic)]">
                {teams.filter(t => t.tier === 'MYTHIC').length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Mythic</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[var(--color-toxic)]">
                {teams.filter(t => t.isOpenSparring).length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Open</p>
            </div>
          </div>

          {/* Report League Match Button */}
          <motion.button
            onClick={() => setShowLeagueMatchModal(true)}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 h-12 rounded-xl bg-[var(--tier-legend)] text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,200,0,0.3)]"
          >
            <Trophy size={20} />
            Report League Match
          </motion.button>
        </div>
      </motion.div>

      {/* Sticky Search & Filters */}
      <div className="sticky top-[var(--header-height)] z-30 glass-elevated">
        <div
          className="max-w-[var(--content-max-width)] mx-auto py-4"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          {/* Search */}
          <div className="relative mb-3">
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

          {/* Filter Tabs */}
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

      {/* League Match Modal */}
      <LeagueMatchModal
        isOpen={showLeagueMatchModal}
        onClose={() => setShowLeagueMatchModal(false)}
      />
    </div>
  )
}
