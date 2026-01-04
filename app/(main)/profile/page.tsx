"use client"

import Link from "next/link"
import { Settings, ChevronRight, LogOut, Shield, Bell, HelpCircle, Flame } from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Mock current user
const mockUser = {
  id: "u001",
  name: "Andi Wijaya",
  phone: "6281234567890",
  avatarUrl: null,
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

export default function ProfilePage() {
  const teams = teamsData as Team[]

  const myTeams = teams.filter(
    (team) =>
      team.captain.id === mockUser.id || team.partner.id === mockUser.id
  )

  const menuItems = [
    { icon: Bell, label: "Notifikasi", href: "/settings/notifications" },
    { icon: Shield, label: "Privasi & Keamanan", href: "/settings/privacy" },
    { icon: HelpCircle, label: "Bantuan", href: "/help" },
    { icon: Settings, label: "Pengaturan", href: "/settings" },
  ]

  const totalBadges = myTeams.reduce((acc, team) => acc + team.badges.length, 0)
  const maxWinStreak = Math.max(...myTeams.map((t) => t.winStreak), 0)

  return (
    <motion.div
      className="min-h-screen"
      style={{ padding: 'var(--page-padding)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-[var(--content-max-width)] mx-auto">
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pt-2">
          <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-[28px] font-bold shadow-lg">
            {mockUser.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-bold tracking-tight">{mockUser.name}</h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-0.5">
              +{mockUser.phone.slice(0, 2)} {mockUser.phone.slice(2, 5)} ****
            </p>
          </div>
        </motion.div>

        {/* My Teams Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[17px]">Tim Saya</h2>
            <Link
              href="/team/create"
              className="text-[14px] text-atomic-purple font-medium"
            >
              + Buat Tim
            </Link>
          </div>

          <div className="space-y-2.5">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                className={cn(
                  "block bg-[var(--dark-card)] border rounded-2xl p-4 active:scale-[0.99] transition-all",
                  team.tier === "MYTHIC"
                    ? "border-violet-500/40"
                    : "border-[var(--dark-border)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-[18px] font-bold">
                    {team.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-[15px] truncate">{team.name}</h3>
                      <TierBadge tier={team.tier} size="sm" />
                      {team.winStreak >= 3 && (
                        <Flame size={14} className="text-orange-500 animate-flicker flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      Rank #{team.rank} • {team.mmr} MMR
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-[var(--text-tertiary)] flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 text-center">
            <p className="text-[22px] font-bold text-atomic-purple">{myTeams.length}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wide">Tim</p>
          </div>
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 text-center">
            <p className="text-[22px] font-bold text-atomic-yellow">{totalBadges}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wide">Badge</p>
          </div>
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 text-center">
            <p className="text-[22px] font-bold text-atomic-green">{maxWinStreak}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wide">Win Streak</p>
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          variants={itemVariants}
          className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl overflow-hidden mb-6"
        >
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 h-[52px] active:bg-[var(--dark-border)]/50 transition-colors",
                index !== menuItems.length - 1 && "border-b border-[var(--dark-border)]"
              )}
            >
              <item.icon size={20} className="text-[var(--text-secondary)]" />
              <span className="flex-1 text-[15px]">{item.label}</span>
              <ChevronRight size={18} className="text-[var(--text-tertiary)]" />
            </Link>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          variants={itemVariants}
          className="w-full flex items-center justify-center gap-2 h-[48px] text-red-500 active:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-[15px]">Keluar</span>
        </motion.button>

        {/* Version */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[12px] text-[var(--text-tertiary)] mt-6 pb-4"
        >
          ZUMATOMIC v1.0.0 (Beta)
        </motion.p>
      </div>
    </motion.div>
  )
}
