"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  Share2,
  Trophy,
  Target,
  Percent,
  Flame,
  Users,
} from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { OpenSparringIndicator } from "@/components/leaderboard/OpenSparringIndicator"
import { BadgeIcon } from "@/components/badges/BadgeIcon"
import { BADGES, BadgeName } from "@/lib/constants"
import { MatchResultCard, MatchResultData } from "@/components/shared/MatchResultCard"
import teamsData from "@/data/mock/teams.json"
import matchesData from "@/data/mock/matches.json"
import { Team } from "@/types"

// Get matches from mock data
const allMatches = matchesData as MatchResultData[]

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const teams = teamsData as Team[]
  const team = teams.find((t) => t.id === id)

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">Tim tidak ditemukan</p>
          <Link href="/leaderboard" className="text-atomic-purple">
            Kembali ke Klasemen
          </Link>
        </div>
      </div>
    )
  }

  // Mock stats
  const stats = {
    matchesPlayed: 15,
    wins: 10,
    losses: 5,
    winRate: 67,
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent h-48" />

        <div className="relative px-4 py-4">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          {/* Team Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--tier-legend)] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {team.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{team.name}</h1>
                <TierBadge tier={team.tier} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span>Rank #{team.rank}</span>
                <span>{team.mmr} LP</span>
              </div>
              <OpenSparringIndicator
                isOpen={team.isOpenSparring}
                showLabel
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="glass-card rounded-xl p-3 text-center">
            <Trophy size={18} className="mx-auto mb-1 text-[var(--tier-legend)]" />
            <div className="text-lg font-bold text-[var(--text-primary)]">{team.rank}</div>
            <div className="text-xs text-[var(--text-secondary)]">Rank</div>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <Target size={18} className="mx-auto mb-1 text-[var(--color-primary)]" />
            <div className="text-lg font-bold text-[var(--text-primary)]">{stats.matchesPlayed}</div>
            <div className="text-xs text-[var(--text-secondary)]">Matches</div>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <Percent size={18} className="mx-auto mb-1 text-green-600" />
            <div className="text-lg font-bold text-[var(--text-primary)]">{stats.winRate}%</div>
            <div className="text-xs text-[var(--text-secondary)]">Win Rate</div>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <Flame size={18} className="mx-auto mb-1 text-orange-500" />
            <div className="text-lg font-bold text-[var(--text-primary)]">{team.winStreak}</div>
            <div className="text-xs text-[var(--text-secondary)]">Streak</div>
          </div>
        </div>

        {/* Members */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[var(--text-secondary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Team Members</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold text-white">
                {team.captain.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{team.captain.name}</p>
                <p className="text-xs text-[var(--color-primary)]">Captain</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold text-white">
                {team.partner.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{team.partner.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">Partner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {team.badges.length > 0 && (
          <div className="glass-card rounded-2xl p-4 mb-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Badge Collection</h2>
            <div className="flex flex-wrap gap-3">
              {team.badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 bg-[var(--bg-input)] rounded-lg px-3 py-2"
                >
                  <BadgeIcon badge={badge} size="md" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {BADGES[badge].name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {BADGES[badge].description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Matches */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Matches</h2>
            <Link
              href={`/team/${team.id}/matches`}
              className="text-sm text-[var(--color-primary)]"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {allMatches
              .filter(match =>
                match.teamA.name === team.name || match.teamB.name === team.name
              )
              .slice(0, 3)
              .map((match) => (
                <MatchResultCard
                  key={match.id}
                  match={match}
                  onClick={() => console.log("Match clicked:", match.id)}
                />
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <a
            href={`https://wa.me/${team.captain.phone}?text=Hi, I'm interested in a match with ${team.name}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={20} />
            Challenge via WA
          </a>
          <button className="p-3 glass-card rounded-xl hover:bg-[var(--bg-input)] transition-colors">
            <Share2 size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  )
}
