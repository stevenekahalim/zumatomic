"use client"

import { Trophy, TrendingUp, Circle, Zap, ChevronRight, Flame, Award } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { MatchResultCard, MatchResultData } from "@/components/shared/MatchResultCard"
import teamsData from "@/data/mock/teams.json"
import matchesData from "@/data/mock/matches.json"
import { Team } from "@/types"

// Mock current user with ONE team per season (One-Team Policy)
const mockUser = {
  id: "u001",
  name: "Andi Wijaya",
  individual_mmr: 4.25,
  mmr_change: +0.05,
}

// Get recent match results from mock data
const recentMatches = (matchesData as MatchResultData[]).slice(0, 3)

// Mock Friends Activity (Social Feed - Secondary Section)
const friendsActivity = [
  {
    id: "f1",
    type: "ranked_match" as const,
    user: "Budi Santoso",
    action: "just finished a Ranked Match",
    result: "Won 6-4, 6-3",
    time: "5 menit lalu",
  },
  {
    id: "f2",
    type: "streak" as const,
    user: "Citra Dewi",
    action: "is on a 5 win streak!",
    time: "12 menit lalu",
  },
  {
    id: "f3",
    type: "ranked_match" as const,
    user: "Deni Pratama",
    action: "played a Ranked Match",
    result: "Lost 4-6, 3-6",
    time: "32 menit lalu",
  },
  {
    id: "f4",
    type: "follow" as const,
    user: "Eka Fitriani",
    action: "started following you",
    time: "1 jam lalu",
  },
  {
    id: "f5",
    type: "badge_unlock" as const,
    user: "Fajar Gunawan",
    badge: "ON_FIRE",
    badgeName: "On Fire",
    badgeEmoji: "🔥",
    action: "just unlocked",
    time: "2 jam lalu",
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

  // ONE-TEAM POLICY: Auto-detect user's registered team for current season
  const myTeam = teams.find(
    (team) => team.captain.id === mockUser.id || team.partner.id === mockUser.id
  )

  return (
    <motion.div
      className="min-h-screen pb-safe"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Static Team Badge Header (No Dropdown) */}
      <motion.div
        variants={itemVariants}
        className="sticky top-[var(--header-height)] z-20 glass-elevated py-3"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        <div className="max-w-[var(--content-max-width)] mx-auto">
          <div className="flex items-center justify-between">
            {/* Static Team Badge - No Selection, Auto-Detected */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${myTeam?.tier === 'MYTHIC' ? 'var(--tier-mythic)' : myTeam?.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                }}
              >
                {myTeam?.name.charAt(0) || "?"}
              </div>
              <div className="text-left">
                <p className="text-xs text-[var(--text-secondary)]">Playing for</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{myTeam?.name || "No Team"}</span>
                  {myTeam && <TierBadge tier={myTeam.tier} size="sm" />}
                </div>
              </div>
            </div>

            {/* Open Status Indicator */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
              "bg-[var(--color-toxic)]/20 text-[var(--color-toxic)]"
            )}>
              <Circle size={8} fill="currentColor" className="animate-pulse" />
              Open
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="max-w-[var(--content-max-width)] mx-auto"
        style={{ padding: 'var(--page-padding)', paddingTop: '16px' }}
      >
        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          {/* Individual MMR */}
          <Link href="/profile" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-white">{mockUser.individual_mmr.toFixed(2)}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp size={12} className="text-[var(--color-toxic)]" />
              <p className="text-[10px] text-[var(--color-toxic)]">+{mockUser.mmr_change.toFixed(2)}</p>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">MMR</p>
          </Link>

          {/* Team LP */}
          <Link href="/league" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-[var(--tier-legend)]">{myTeam?.mmr || "-"}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">League Points</p>
          </Link>

          {/* Rank */}
          <Link href="/league" className="glass-card p-3 text-center hover:bg-white/5 transition-colors">
            <p className="text-2xl font-bold font-mono text-white">#{myTeam?.rank || "-"}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">Rank</p>
          </Link>
        </motion.div>

        {/* SECTION 1: RECENT MATCHES */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[var(--tier-legend)]" />
              <h2 className="font-semibold text-[17px] text-[var(--text-primary)]">Recent Matches</h2>
            </div>
            <Link href="/match/history" className="text-xs text-[var(--color-primary)] flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {/* Match Cards */}
          <div className="space-y-3">
            {recentMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MatchResultCard
                  match={match}
                  onClick={() => console.log("Match clicked:", match.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 2: FRIENDS ACTIVITY (Secondary - Vertical List) */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[var(--color-toxic)]" />
              <h2 className="font-semibold text-[17px]">Friends Activity</h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-toxic)] animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-2.5">
            {friendsActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    activity.type === "streak"
                      ? "bg-orange-500/20 text-orange-500"
                      : activity.type === "follow"
                        ? "bg-[var(--tier-epic)]/20 text-[var(--tier-epic)]"
                        : activity.type === "badge_unlock"
                          ? "bg-[var(--tier-legend)]/20 text-[var(--tier-legend)]"
                          : "bg-white/10 text-white"
                  )}>
                    {activity.type === "streak" ? (
                      <Flame size={18} />
                    ) : activity.type === "badge_unlock" ? (
                      <Award size={18} />
                    ) : (
                      activity.user.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {activity.type === "badge_unlock" ? (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-[var(--text-secondary)]"> {activity.action} </span>
                        <span className="font-semibold text-[var(--tier-legend)]">{activity.badgeName}</span>
                        <span className="ml-1">{activity.badgeEmoji}</span>
                      </p>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-[var(--text-secondary)]"> {activity.action}</span>
                      </p>
                    )}
                    {activity.result && (
                      <p className={cn(
                        "text-xs font-medium mt-0.5",
                        activity.result.includes("Won") ? "text-[var(--color-toxic)]" : "text-red-400"
                      )}>
                        {activity.result}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
