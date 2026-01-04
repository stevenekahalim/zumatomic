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
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"

// Mock match data
const mockMatches = [
  {
    id: "match-001",
    opponent: "Padel Bros",
    score: "6-4",
    isWin: true,
    date: "2025-01-03",
  },
  {
    id: "match-002",
    opponent: "Smash Kings",
    score: "6-3",
    isWin: true,
    date: "2025-01-02",
  },
  {
    id: "match-003",
    opponent: "Court Crushers",
    score: "4-6",
    isWin: false,
    date: "2024-12-28",
  },
]

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
    <div className="min-h-screen">
      {/* Header with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-atomic-purple/30 to-transparent h-48" />

        <div className="relative px-4 py-4">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>

          {/* Team Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-2xl font-bold shadow-lg">
              {team.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{team.name}</h1>
                <TierBadge tier={team.tier} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span>Rank #{team.rank}</span>
                <span>{team.mmr} MMR</span>
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
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <Trophy size={18} className="mx-auto mb-1 text-atomic-yellow" />
            <div className="text-lg font-bold">{team.rank}</div>
            <div className="text-xs text-[var(--text-secondary)]">Rank</div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <Target size={18} className="mx-auto mb-1 text-atomic-purple" />
            <div className="text-lg font-bold">{stats.matchesPlayed}</div>
            <div className="text-xs text-[var(--text-secondary)]">Matches</div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <Percent size={18} className="mx-auto mb-1 text-atomic-green" />
            <div className="text-lg font-bold">{stats.winRate}%</div>
            <div className="text-xs text-[var(--text-secondary)]">Win Rate</div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
            <Flame size={18} className="mx-auto mb-1 text-orange-500" />
            <div className="text-lg font-bold">{team.winStreak}</div>
            <div className="text-xs text-[var(--text-secondary)]">Streak</div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[var(--text-secondary)]" />
            <h2 className="font-semibold">Anggota Tim</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-dark-border flex items-center justify-center font-bold">
                {team.captain.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{team.captain.name}</p>
                <p className="text-xs text-atomic-purple">Captain</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-dark-border flex items-center justify-center font-bold">
                {team.partner.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{team.partner.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">Partner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {team.badges.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
            <h2 className="font-semibold mb-4">Badge Collection</h2>
            <div className="flex flex-wrap gap-3">
              {team.badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 bg-dark-border rounded-lg px-3 py-2"
                >
                  <BadgeIcon badge={badge} size="md" />
                  <div>
                    <p className="text-sm font-medium">
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
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pertandingan Terakhir</h2>
            <Link
              href={`/team/${team.id}/matches`}
              className="text-sm text-atomic-purple"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {mockMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between py-2 border-b border-dark-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      match.isWin ? "bg-atomic-green" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">vs {match.opponent}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {match.date}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    match.isWin ? "text-atomic-green" : "text-red-500"
                  }`}
                >
                  {match.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <a
            href={`https://wa.me/${team.captain.phone}?text=Halo, saya tertarik untuk sparring dengan tim ${team.name}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-atomic-green text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
          >
            <MessageCircle size={20} />
            Challenge via WA
          </a>
          <button className="p-3 bg-dark-card border border-dark-border rounded-xl hover:bg-dark-border transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
