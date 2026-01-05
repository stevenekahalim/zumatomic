"use client"

import Link from "next/link"
import { Settings, ChevronRight, TrendingUp, TrendingDown, Trophy, Flame, Users, Target, Percent } from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Mock current user with Individual MMR
const mockUser = {
  id: "u001",
  name: "Andi Wijaya",
  phone: "6281234567890",
  avatarUrl: null,
  individual_mmr: 4.25,        // Individual MMR (DUPR-style)
  mmr_change: +0.05,           // Recent change
  percentile: 15,              // Top 15%
  total_matches: 47,
  win_rate: 68,
  current_streak: 3,
  best_streak: 7,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
}

export default function CareerPage() {
  const teams = teamsData as Team[]

  const myTeams = teams.filter(
    (team) =>
      team.captain.id === mockUser.id || team.partner.id === mockUser.id
  )

  const isPositiveChange = mockUser.mmr_change >= 0

  return (
    <motion.div
      className="min-h-screen pb-safe"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section - Individual MMR Display */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(204,255,0,0.08) 0%, transparent 100%)',
          padding: 'var(--page-padding)',
          paddingTop: '24px',
          paddingBottom: '32px',
        }}
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[var(--color-toxic)]/10 blur-[100px]" />

        <div className="max-w-[var(--content-max-width)] mx-auto relative z-10">
          {/* Profile header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--tier-mythic)] to-[var(--tier-legend)] flex items-center justify-center text-xl font-bold shadow-lg">
                {mockUser.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold">{mockUser.name}</h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Top {mockUser.percentile}% pemain
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center"
            >
              <Settings size={20} className="text-[var(--text-secondary)]" />
            </Link>
          </div>

          {/* Big MMR Display */}
          <div className="text-center mb-6">
            <p className="text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Individual MMR
            </p>
            <div className="flex items-center justify-center gap-3">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl font-bold font-mono text-white"
                style={{ textShadow: '0 0 40px rgba(204,255,0,0.3)' }}
              >
                {mockUser.individual_mmr.toFixed(2)}
              </motion.span>
            </div>
            {/* MMR Change */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-full text-sm font-medium",
                isPositiveChange
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {isPositiveChange ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {isPositiveChange ? "+" : ""}{mockUser.mmr_change.toFixed(3)} minggu ini
              </span>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="glass-card rounded-xl p-3 text-center">
              <Target size={18} className="mx-auto mb-1 text-[var(--color-toxic)]" />
              <p className="text-lg font-bold">{mockUser.total_matches}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase">Match</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Percent size={18} className="mx-auto mb-1 text-[var(--tier-legend)]" />
              <p className="text-lg font-bold">{mockUser.win_rate}%</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase">Win Rate</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Flame size={18} className="mx-auto mb-1 text-orange-500" />
              <p className="text-lg font-bold">{mockUser.current_streak}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase">Streak</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Trophy size={18} className="mx-auto mb-1 text-[var(--tier-mythic)]" />
              <p className="text-lg font-bold">{mockUser.best_streak}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase">Best</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div
        className="max-w-[var(--content-max-width)] mx-auto"
        style={{ padding: 'var(--page-padding)' }}
      >
        {/* My Teams Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[var(--text-secondary)]" />
              <h2 className="font-semibold text-[17px]">Tim Saya</h2>
            </div>
            <Link
              href="/team/create"
              className="text-[14px] text-[var(--color-toxic)] font-medium"
            >
              + Buat Tim
            </Link>
          </div>

          <div className="space-y-2.5">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                className="block glass-card rounded-2xl p-4 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${team.tier === 'MYTHIC' ? 'var(--tier-mythic)' : team.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                    }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-[15px] truncate">{team.name}</h3>
                      <TierBadge tier={team.tier} size="sm" />
                      {team.winStreak >= 3 && (
                        <Flame size={14} className="text-orange-500 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
                      <span>Rank #{team.rank}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                      <span className="text-[var(--color-toxic)] font-medium">{team.mmr} LP</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--text-tertiary)] flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart Placeholder */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="font-semibold text-[17px] mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--text-secondary)]" />
            Performa
          </h2>
          <div className="glass-card rounded-2xl p-6">
            {/* Mini chart placeholder */}
            <div className="flex items-end justify-between h-24 mb-4 gap-1">
              {[65, 80, 60, 90, 75, 85, 70, 95, 88, 92].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    i >= 7 ? "bg-[var(--color-toxic)]" : "bg-white/20"
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>10 match terakhir</span>
              <span className="text-[var(--color-toxic)]">+0.15 MMR</span>
            </div>
          </div>
        </motion.div>

        {/* Best Partners */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="font-semibold text-[17px] mb-4">Partner Terbaik</h2>
          <div className="space-y-2">
            {[
              { name: "Budi Santoso", winRate: 75, matches: 12 },
              { name: "Citra Dewi", winRate: 67, matches: 9 },
              { name: "Deni Pratama", winRate: 60, matches: 5 },
            ].map((partner, i) => (
              <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-medium">
                  {partner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{partner.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {partner.matches} match bersama
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold text-sm",
                    partner.winRate >= 70 ? "text-[var(--color-toxic)]" : "text-white"
                  )}>
                    {partner.winRate}%
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">win rate</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[12px] text-[var(--text-tertiary)] mt-8 pb-4"
        >
          ZUMATOMIC v2.0 (Hybrid Model)
        </motion.p>
      </div>
    </motion.div>
  )
}
