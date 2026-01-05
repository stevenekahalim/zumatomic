"use client"

import { useState } from "react"
import { Plus, MapPin, Clock, Copy, Check, MessageCircle, Send, Users } from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { cn } from "@/lib/utils"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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

// Mock chat messages
const mockChatMessages = [
  {
    id: "msg-001",
    userId: "u001",
    userName: "Andi Wijaya",
    tier: "MYTHIC" as const,
    message: "Ada yang mau main besok pagi?",
    time: "10:32",
  },
  {
    id: "msg-002",
    userId: "u002",
    userName: "Budi Santoso",
    tier: "LEGEND" as const,
    message: "Gue ready! Lokasi mana?",
    time: "10:33",
  },
  {
    id: "msg-003",
    userId: "u003",
    userName: "Citra Dewi",
    tier: "EPIC" as const,
    message: "Count me in juga dong",
    time: "10:35",
  },
  {
    id: "msg-004",
    userId: "u001",
    userName: "Andi Wijaya",
    tier: "MYTHIC" as const,
    message: "Nice! Padel House Barat jam 8 ya",
    time: "10:36",
  },
  {
    id: "msg-005",
    userId: "u004",
    userName: "Deni Pratama",
    tier: "HERALD" as const,
    message: "Kalau sore ada slot nggak?",
    time: "10:40",
  },
]

const locationLabels: Record<string, string> = {
  WEST: "Jakarta Barat",
  EAST: "Jakarta Timur",
  CENTER: "Jakarta Pusat",
}

type TabType = "market" | "chat"

export default function LobbyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("market")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")

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

#ZUMATOMIC #PadelJakarta`

    navigator.clipboard.writeText(text)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div className="sticky top-[var(--header-height)] z-30 glass-elevated">
        <div
          className="max-w-[var(--content-max-width)] mx-auto py-4"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-[20px]">Lobby</h1>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Match Market & Global Chat
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("market")}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                activeTab === "market"
                  ? "bg-[var(--color-toxic)] text-black"
                  : "glass-card text-[var(--text-secondary)]"
              )}
            >
              <Users size={18} />
              Match Market
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                activeTab === "chat"
                  ? "bg-[var(--color-toxic)] text-black"
                  : "glass-card text-[var(--text-secondary)]"
              )}
            >
              <MessageCircle size={18} />
              Global Chat
            </button>
          </div>

          {/* Location Filter (only for Market tab) */}
          {activeTab === "market" && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
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
                      ? "bg-[var(--tier-mythic)] text-white"
                      : "glass-card text-[var(--text-secondary)]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "market" ? (
          <motion.div
            key="market"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-[var(--content-max-width)] mx-auto py-4 space-y-3"
            style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
          >
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={24} className="text-[var(--text-tertiary)]" />
                </div>
                <p className="text-[var(--text-secondary)]">
                  Belum ada post LFO untuk lokasi ini
                </p>
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                const team = getTeamById(post.teamId)
                if (!team) return null

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-4"
                  >
                    {/* Team Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-bold"
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
                        className="flex-1 h-11 bg-[var(--color-toxic)] text-black text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        <MessageCircle size={16} />
                        Hubungi via WA
                      </a>
                      <button
                        onClick={() => copyForReclub(post)}
                        className="h-11 px-4 glass-card text-[14px] font-medium rounded-xl flex items-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check size={16} className="text-[var(--color-toxic)]" />
                            <span className="text-[var(--color-toxic)]">Copied!</span>
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
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
            style={{ height: 'calc(100vh - var(--header-height) - var(--bottom-nav-height) - 150px)' }}
          >
            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto py-4 space-y-3"
              style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
            >
              {mockChatMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex gap-3",
                    msg.userId === "u001" && "flex-row-reverse"
                  )}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${msg.tier === 'MYTHIC' ? 'var(--tier-mythic)' : msg.tier === 'LEGEND' ? 'var(--tier-legend)' : msg.tier === 'EPIC' ? 'var(--tier-epic)' : 'var(--tier-herald)'} 0%, var(--bg-void) 100%)`,
                      }}
                    >
                      {msg.userName.charAt(0)}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%]",
                      msg.userId === "u001" ? "text-right" : "text-left"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.userId !== "u001" && (
                        <>
                          <span className="text-sm font-medium">{msg.userName}</span>
                          <TierBadge tier={msg.tier} size="sm" />
                        </>
                      )}
                      <span className="text-xs text-[var(--text-tertiary)]">{msg.time}</span>
                    </div>
                    <div
                      className={cn(
                        "inline-block px-4 py-2.5 rounded-2xl text-sm",
                        msg.userId === "u001"
                          ? "bg-[var(--color-toxic)] text-black rounded-br-md"
                          : "glass-card rounded-bl-md"
                      )}
                    >
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Chat Notice */}
              <div className="text-center py-4">
                <p className="text-xs text-[var(--text-tertiary)]">
                  Powered by Zumatomic • Be respectful
                </p>
              </div>
            </div>

            {/* Chat Input */}
            <div
              className="glass-elevated border-t border-white/10 p-4"
              style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
            >
              <div className="max-w-[var(--content-max-width)] mx-auto flex gap-3">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-xl glass-card border-0 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                />
                <button
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                    chatMessage.trim()
                      ? "bg-[var(--color-toxic)] text-black"
                      : "glass-card text-[var(--text-tertiary)]"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB - Announce LFO (only for Market tab) */}
      {activeTab === "market" && (
        <Link href="/play/broadcast">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed z-40 w-14 h-14 rounded-2xl bg-[var(--color-toxic)] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center justify-center cursor-pointer"
            style={{
              bottom: 'calc(var(--bottom-nav-height) + 16px)',
              right: 'var(--page-padding)',
            }}
          >
            <Plus size={26} strokeWidth={2.5} />
          </motion.div>
        </Link>
      )}
    </div>
  )
}
