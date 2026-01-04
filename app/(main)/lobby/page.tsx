"use client"

import { useState } from "react"
import { Plus, MapPin, Clock, Copy, Check, MessageCircle } from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { cn } from "@/lib/utils"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

// Mock LFO posts
const mockLFOPosts = [
  {
    id: "lfo-001",
    teamId: "team-001",
    message: "Cari lawan untuk sparring sore ini!",
    preferredDate: "2025-01-05",
    preferredTime: "16:00-18:00",
    location: "WEST",
    isActive: true,
    createdAt: "2025-01-04T10:00:00Z",
  },
  {
    id: "lfo-002",
    teamId: "team-005",
    message: "Open untuk weekend game",
    preferredDate: "2025-01-06",
    preferredTime: "09:00-12:00",
    location: "EAST",
    isActive: true,
    createdAt: "2025-01-04T09:00:00Z",
  },
  {
    id: "lfo-003",
    teamId: "team-009",
    message: "Malam ini ada slot? DM ya",
    preferredDate: "2025-01-04",
    preferredTime: "20:00-22:00",
    location: "CENTER",
    isActive: true,
    createdAt: "2025-01-04T08:00:00Z",
  },
]

const locationLabels: Record<string, string> = {
  WEST: "Surabaya Barat",
  EAST: "Surabaya Timur",
  CENTER: "Surabaya Pusat",
}

export default function LobbyPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const teams = teamsData as Team[]

  const getTeamById = (id: string) => teams.find((t) => t.id === id)

  const filteredPosts = mockLFOPosts.filter((post) => {
    if (activeFilter === "all") return true
    return post.location === activeFilter
  })

  const copyForReclub = (post: typeof mockLFOPosts[0]) => {
    const team = getTeamById(post.teamId)
    if (!team) return

    const text = `LFO - Looking for Opponent

Tim: ${team.name}
Tier: ${team.tier}
Tanggal: ${post.preferredDate}
Waktu: ${post.preferredTime}
Lokasi: ${locationLabels[post.location]}

${post.message || "Siap tanding!"}

Contact via WA: wa.me/${team.captain.phone}

#ZUMATOMIC #PadelSurabaya`

    navigator.clipboard.writeText(text)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-[var(--header-height)] z-30 bg-[var(--dark-bg)]/95 backdrop-blur-lg border-b border-[var(--dark-border)]">
        <div
          className="max-w-[var(--content-max-width)] mx-auto py-4"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-[20px]">LFO Lobby</h1>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Looking for Opponent
              </p>
            </div>
          </div>

          {/* Location Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5">
            {[
              { value: "all", label: "Semua" },
              { value: "WEST", label: "Barat" },
              { value: "EAST", label: "Timur" },
              { value: "CENTER", label: "Pusat" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0",
                  activeFilter === tab.value
                    ? "bg-atomic-purple text-white"
                    : "bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--text-secondary)] active:bg-[var(--dark-border)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LFO Posts */}
      <div
        className="max-w-[var(--content-max-width)] mx-auto py-4 space-y-3"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--dark-card)] flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-[var(--text-tertiary)]" />
            </div>
            <p className="text-[var(--text-secondary)]">
              Belum ada post LFO untuk lokasi ini
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post, index) => {
              const team = getTeamById(post.teamId)
              if (!team) return null

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-4"
                >
                  {/* Team Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-[16px] font-bold">
                      {team.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-[15px] truncate">{team.name}</h3>
                        <TierBadge tier={team.tier} size="sm" />
                      </div>
                      <p className="text-[13px] text-[var(--text-secondary)] truncate">
                        {team.captain.name} & {team.partner.name}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {post.message && (
                    <p className="text-[14px] mb-3 leading-relaxed">{post.message}</p>
                  )}

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--text-secondary)] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[var(--text-tertiary)]" />
                      <span>{post.preferredDate} • {post.preferredTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[var(--text-tertiary)]" />
                      <span>{locationLabels[post.location]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${team.captain.phone}?text=Halo, saya tertarik untuk sparring dengan tim ${team.name}!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-11 bg-atomic-green text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <MessageCircle size={16} />
                      Hubungi via WA
                    </a>
                    <button
                      onClick={() => copyForReclub(post)}
                      className="h-11 px-4 bg-[var(--dark-border)] text-[14px] font-medium rounded-xl flex items-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check size={16} className="text-atomic-green" />
                          <span className="text-atomic-green">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Reclub
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* FAB - Announce LFO */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-atomic-purple to-atomic-pink shadow-lg shadow-atomic-purple/30 flex items-center justify-center"
        style={{
          bottom: 'calc(var(--bottom-nav-height) + 16px)',
          right: 'var(--page-padding)',
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
