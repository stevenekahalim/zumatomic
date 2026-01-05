"use client"

import Link from "next/link"
import {
  ChevronRight, TrendingUp, TrendingDown,
  Trophy, Flame, Hand, MapPin, Sun, Swords
} from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { AchievementsSection } from "@/components/profile/AchievementsSection"
import { MatchResultCard, MatchResultData } from "@/components/shared/MatchResultCard"
import { BadgeName } from "@/lib/constants"
import teamsData from "@/data/mock/teams.json"
import matchesData from "@/data/mock/matches.json"
import { Team } from "@/types"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock current user with full profile data
const mockUser = {
  id: "u001",
  name: "Andi Wijaya",
  phone: "6281234567890",
  location: "Jakarta, Indonesia",
  avatarUrl: null,
  individual_mmr: 4.25,
  mmr_reliability: "High" as const,
  mmr_change: +0.05,
  percentile: 15,
  total_matches: 47,
  matches_won: 32,
  matches_lost: 15,
  followers: 128,
  following: 89,
  current_streak: 3,
  best_streak: 7,
  // Preferences
  hand_dominance: "Right" as const,
  court_position: "Right side" as const,
  match_preference: "Competitive" as const,
  play_time: "Evening" as const,
}

// Mock MMR history data for chart
const mmrHistoryData = [
  { date: "Nov 1", mmr: 3.85 },
  { date: "Nov 8", mmr: 3.92 },
  { date: "Nov 15", mmr: 4.01 },
  { date: "Nov 22", mmr: 3.95 },
  { date: "Nov 29", mmr: 4.08 },
  { date: "Dec 6", mmr: 4.15 },
  { date: "Dec 13", mmr: 4.10 },
  { date: "Dec 20", mmr: 4.18 },
  { date: "Dec 27", mmr: 4.22 },
  { date: "Jan 3", mmr: 4.25 },
]

// Get recent matches from mock data
const recentMatches = (matchesData as MatchResultData[]).slice(0, 4)

// Mock user achievements (badges unlocked)
const mockUserAchievements: { badge: BadgeName; unlockedAt: string }[] = [
  { badge: "ON_FIRE", unlockedAt: "2026-01-03T00:00:00Z" },
  { badge: "GIANT_SLAYER", unlockedAt: "2026-01-01T00:00:00Z" },
  { badge: "MARATHON", unlockedAt: "2025-12-28T00:00:00Z" },
  { badge: "NIGHT_OWL", unlockedAt: "2025-12-15T00:00:00Z" },
]

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

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-sm">
        <p className="text-[var(--text-secondary)]">{label}</p>
        <p className="font-bold text-[var(--color-toxic)]">
          MMR: {payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

export default function ProfilePage() {
  const teams = teamsData as Team[]

  const myTeams = teams.filter(
    (team) =>
      team.captain.id === mockUser.id || team.partner.id === mockUser.id
  )

  const isPositiveChange = mockUser.mmr_change >= 0
  const winRate = Math.round((mockUser.matches_won / mockUser.total_matches) * 100)

  return (
    <motion.div
      className="min-h-screen pb-safe bg-[var(--bg-void)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ===== A. HEADER SECTION (Identity) ===== */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden pt-6 pb-8"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        {/* Avatar + Name + Location (Centered) */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--tier-mythic)] to-[var(--tier-legend)] flex items-center justify-center text-2xl font-bold shadow-lg mb-3">
            {mockUser.name.charAt(0)}
          </div>
          <h1 className="text-xl font-bold mb-1">{mockUser.name}</h1>
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
            <MapPin size={14} />
            {mockUser.location}
          </p>
        </div>

        {/* Stats Row (Matches | Followers | Following) */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{mockUser.total_matches}</p>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Matches</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{mockUser.followers}</p>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{mockUser.following}</p>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Following</p>
          </div>
        </div>

      </motion.div>

      <div
        className="max-w-[var(--content-max-width)] mx-auto"
        style={{ padding: 'var(--page-padding)', paddingTop: 0 }}
      >
        {/* ===== B. THE LEVEL CARD (Hero MMR) ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <Link href="/profile/mmr-history">
            <div
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(204,255,0,0.08) 0%, rgba(0,30,0,0.3) 100%)',
              }}
            >
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--color-toxic)]/10 blur-[60px]" />

              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Individual Level
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-5xl font-bold font-mono text-white block"
                    style={{ textShadow: '0 0 40px rgba(204,255,0,0.3)' }}
                  >
                    {mockUser.individual_mmr.toFixed(2)}
                  </motion.span>

                  {/* MMR Change Badge */}
                  <div className={cn(
                    "inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-medium",
                    isPositiveChange
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {isPositiveChange ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositiveChange ? "+" : ""}{mockUser.mmr_change.toFixed(3)}
                  </div>
                </div>

                {/* Reliability Badge */}
                <div className="glass-card px-3 py-1.5 rounded-full">
                  <p className="text-xs text-white">
                    Reliability: <span className="text-[var(--color-toxic)] font-medium">{mockUser.mmr_reliability}</span>
                  </p>
                </div>
              </div>

              <ChevronRight size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            </div>
          </Link>
        </motion.div>

        {/* ===== C. LEVEL PROGRESSION (Chart) ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-3">
            Level Progression
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mmrHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMmr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#CCFF00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mmr"
                  stroke="#CCFF00"
                  strokeWidth={3}
                  fill="url(#colorMmr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ===== D. STATISTICS GRID ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-3">
            Statistics
          </h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex">
              {/* Zone 1: Numerical Stats */}
              <div className="flex-1 space-y-4 pr-6 border-r border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">{mockUser.total_matches}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Total Matches</p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-lg font-bold text-green-400">{mockUser.matches_won}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Won</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-400">{mockUser.matches_lost}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Lost</p>
                  </div>
                </div>
              </div>

              {/* Zone 2: Donut Chart (Win Rate) */}
              <div className="flex-1 flex items-center justify-center pl-6">
                <div className="relative w-24 h-24">
                  {/* SVG Donut */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Track */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#333"
                      strokeWidth="4"
                    />
                    {/* Progress */}
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#CCFF00"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${winRate * 0.88} 88`}
                      initial={{ strokeDasharray: "0 88" }}
                      animate={{ strokeDasharray: `${winRate * 0.88} 88` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">{winRate}%</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">WIN RATE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Stats */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm">
                  <span className="text-white font-medium">{mockUser.current_streak}</span>
                  <span className="text-[var(--text-secondary)]"> current streak</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[var(--tier-mythic)]" />
                <span className="text-sm">
                  <span className="text-white font-medium">{mockUser.best_streak}</span>
                  <span className="text-[var(--text-secondary)]"> best streak</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== ACHIEVEMENTS SECTION ===== */}
        <motion.div variants={itemVariants}>
          <AchievementsSection achievements={mockUserAchievements} />
        </motion.div>

        {/* ===== E. PLAYER PREFERENCES ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">
              Player Preferences
            </h2>
            <button className="text-xs text-[var(--color-toxic)] font-medium">
              Edit
            </button>
          </div>
          <div className="glass-card rounded-2xl divide-y divide-white/10">
            {[
              { icon: Hand, label: "Best Hand", value: mockUser.hand_dominance },
              { icon: MapPin, label: "Court Position", value: mockUser.court_position },
              { icon: Swords, label: "Match Type", value: mockUser.match_preference },
              { icon: Sun, label: "Preferred Time", value: mockUser.play_time },
            ].map((pref, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <pref.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">{pref.label}</p>
                  <p className="text-sm font-medium text-white">{pref.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== F. MATCH HISTORY ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">
              Recent Matches
            </h2>
            <Link href="/match/history" className="text-xs text-[var(--color-toxic)] font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <MatchResultCard
                key={match.id}
                match={match}
                onClick={() => console.log("Match clicked:", match.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* ===== MY TEAMS SECTION ===== */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">
              My Teams
            </h2>
            <Link href="/team/create" className="text-xs text-[var(--color-toxic)] font-medium">
              + Create
            </Link>
          </div>
          <div className="space-y-2">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                className="block glass-card rounded-xl p-4 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${team.tier === 'MYTHIC' ? 'var(--tier-mythic)' : team.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                    }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-sm truncate">{team.name}</h3>
                      <TierBadge tier={team.tier} size="sm" />
                      {team.winStreak >= 3 && (
                        <Flame size={14} className="text-orange-500 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
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
