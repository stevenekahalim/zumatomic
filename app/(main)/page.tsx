"use client"

import { useState } from "react"
import { Trophy, TrendingUp, ChevronDown, Circle, Zap, MessageSquare, Users, Clock, Target, ChevronRight, Flame } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"

// Mock current user with teams
const mockUser = {
  id: "u001",
  name: "Andi Wijaya",
  individual_mmr: 4.25,
  mmr_change: +0.05,
}

// Mock activity feed
const mockActivities = [
  {
    id: "1",
    type: "match_result" as const,
    teamA: "Duo Maut",
    teamB: "Padel Bros",
    score: "6-4",
    winner: "teamA",
    time: "2 menit lalu",
  },
  {
    id: "2",
    type: "rank_up" as const,
    team: "Thunder Duo",
    newTier: "LEGEND" as const,
    time: "15 menit lalu",
  },
  {
    id: "3",
    type: "match_result" as const,
    teamA: "Night Owls",
    teamB: "Sunrise Padel",
    score: "6-3",
    winner: "teamB",
    time: "32 menit lalu",
  },
  {
    id: "4",
    type: "streak" as const,
    team: "Duo Maut",
    streak: 5,
    time: "1 jam lalu",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}

export default function HomePage() {
  const teams = teamsData as Team[]
  const [isTeamSwitcherOpen, setIsTeamSwitcherOpen] = useState(false)
  const [isOpenSparring, setIsOpenSparring] = useState(true)

  // Get user's teams
  const myTeams = teams.filter(
    (team) => team.captain.id === mockUser.id || team.partner.id === mockUser.id
  )
  const [activeTeam, setActiveTeam] = useState(myTeams[0])

  return (
    <motion.div
      className="min-h-screen pb-safe"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Context Switcher Header */}
      <motion.div
        variants={itemVariants}
        className="sticky top-[var(--header-height)] z-20 glass-elevated py-3"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        <div className="max-w-[var(--content-max-width)] mx-auto">
          <div className="flex items-center justify-between">
            {/* Team Switcher */}
            <button
              onClick={() => setIsTeamSwitcherOpen(!isTeamSwitcherOpen)}
              className="flex items-center gap-3 -ml-1 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${activeTeam?.tier === 'MYTHIC' ? 'var(--tier-mythic)' : activeTeam?.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                }}
              >
                {activeTeam?.name.charAt(0) || "?"}
              </div>
              <div className="text-left">
                <p className="text-xs text-[var(--text-secondary)]">Playing as</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{activeTeam?.name || "Pilih Tim"}</span>
                  <ChevronDown size={16} className={cn(
                    "text-[var(--text-secondary)] transition-transform",
                    isTeamSwitcherOpen && "rotate-180"
                  )} />
                </div>
              </div>
            </button>

            {/* Open Sparring Toggle */}
            <button
              onClick={() => setIsOpenSparring(!isOpenSparring)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all",
                isOpenSparring
                  ? "bg-[var(--color-toxic)]/20 text-[var(--color-toxic)]"
                  : "bg-white/5 text-[var(--text-secondary)]"
              )}
            >
              <Circle
                size={8}
                fill={isOpenSparring ? "currentColor" : "transparent"}
                className={cn(
                  isOpenSparring && "animate-pulse"
                )}
              />
              Open
            </button>
          </div>

          {/* Team Switcher Dropdown */}
          <AnimatePresence>
            {isTeamSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {myTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => {
                        setActiveTeam(team)
                        setIsTeamSwitcherOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        activeTeam?.id === team.id
                          ? "bg-[var(--color-toxic)]/10 border border-[var(--color-toxic)]/30"
                          : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium">
                        {team.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{team.name}</span>
                          <TierBadge tier={team.tier} size="sm" />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Rank #{team.rank} • {team.mmr} LP
                        </p>
                      </div>
                      {activeTeam?.id === team.id && (
                        <div className="w-2 h-2 rounded-full bg-[var(--color-toxic)]" />
                      )}
                    </button>
                  ))}
                  <Link
                    href="/team/create"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-[var(--text-secondary)] hover:text-white hover:border-white/40 transition-all"
                  >
                    <Users size={18} />
                    <span className="text-sm font-medium">Buat Tim Baru</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div
        className="max-w-[var(--content-max-width)] mx-auto"
        style={{ padding: 'var(--page-padding)', paddingTop: '16px' }}
      >
        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          {/* Individual MMR */}
          <Link href="/career" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-white">{mockUser.individual_mmr.toFixed(2)}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp size={12} className="text-[var(--color-toxic)]" />
              <p className="text-[10px] text-[var(--color-toxic)]">+{mockUser.mmr_change.toFixed(2)}</p>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">MMR</p>
          </Link>

          {/* Team LP */}
          <Link href="/league" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-[var(--tier-legend)]">{activeTeam?.mmr || 1000}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">League Points</p>
          </Link>

          {/* Rank */}
          <Link href="/league" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-white">#{activeTeam?.rank || "-"}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">Rank</p>
          </Link>
        </motion.div>

        {/* Forecast Widget */}
        <motion.div variants={itemVariants}>
          <Link
            href="/play/forecast"
            className="block glass-card p-4 mb-6 relative overflow-hidden group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--tier-mythic)]/20 flex items-center justify-center">
                <Target size={24} className="text-[var(--tier-mythic)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-0.5">Match Forecast</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Prediksi hasil pertandinganmu
                </p>
              </div>
              <ChevronRight size={20} className="text-[var(--text-tertiary)] group-hover:text-white transition-colors" />
            </div>
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--tier-mythic)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[17px]">Activity Feed</h2>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-toxic)] animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-2.5">
            {mockActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-3"
              >
                {activity.type === "match_result" && (
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                      activity.winner === "teamA" ? "bg-[var(--color-toxic)]/20 text-[var(--color-toxic)]" : "bg-white/10 text-white"
                    )}>
                      {activity.teamA.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm truncate",
                          activity.winner === "teamA" && "text-[var(--color-toxic)]"
                        )}>
                          {activity.teamA}
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">vs</span>
                        <span className={cn(
                          "font-medium text-sm truncate",
                          activity.winner === "teamB" && "text-[var(--color-toxic)]"
                        )}>
                          {activity.teamB}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">{activity.score}</p>
                    </div>
                  </div>
                )}

                {activity.type === "rank_up" && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--tier-legend)]/20 flex items-center justify-center">
                      <Trophy size={20} className="text-[var(--tier-legend)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{activity.team}</span>
                        <span className="text-xs text-[var(--text-secondary)]">naik ke</span>
                        <TierBadge tier={activity.newTier} size="sm" />
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                    </div>
                  </div>
                )}

                {activity.type === "streak" && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Flame size={20} className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{activity.team}</span>
                        <span className="text-orange-500 font-bold text-sm">{activity.streak} Win Streak!</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/lobby"
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            <MessageSquare size={20} className="text-[var(--tier-epic)]" />
            <div>
              <p className="font-medium text-sm">Match Market</p>
              <p className="text-xs text-[var(--text-secondary)]">5 LFO aktif</p>
            </div>
          </Link>
          <Link
            href="/match/history"
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            <Clock size={20} className="text-[var(--text-secondary)]" />
            <div>
              <p className="font-medium text-sm">Riwayat Match</p>
              <p className="text-xs text-[var(--text-secondary)]">Lihat semua</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
