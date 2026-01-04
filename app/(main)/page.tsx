"use client"

import { Trophy, Users, PlusCircle, Swords, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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
  return (
    <motion.div
      className="min-h-screen pb-safe"
      style={{ padding: 'var(--page-padding)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-[var(--content-max-width)] mx-auto">
        {/* User Greeting */}
        <motion.div variants={itemVariants} className="mb-6 pt-2">
          <p className="text-[13px] text-[var(--text-secondary)] mb-1">Selamat datang,</p>
          <h1 className="text-display">Alex Smith</h1>
        </motion.div>

        {/* Quick Actions - Bento Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
          {/* Primary CTA - Input Skor */}
          <Link
            href="/match/new"
            className="glass-card p-4 flex flex-col relative overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-toxic)]/10 flex items-center justify-center mb-3">
              <PlusCircle size={22} className="text-[var(--color-toxic)]" strokeWidth={2} />
            </div>
            <h3 className="text-title mb-0.5">Input Skor</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Catat hasil match</p>
            {/* Toxic glow accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-toxic)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className="glass-card p-4 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--tier-legend)]/10 flex items-center justify-center mb-3">
              <Trophy size={22} className="text-[var(--tier-legend)]" strokeWidth={2} />
            </div>
            <h3 className="text-title mb-0.5">Klasemen</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Lihat peringkat</p>
          </Link>

          {/* LFO Lobby */}
          <Link
            href="/lobby"
            className="glass-card p-4 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--tier-epic)]/10 flex items-center justify-center mb-3">
              <Swords size={22} className="text-[var(--tier-epic)]" strokeWidth={2} />
            </div>
            <h3 className="text-title mb-0.5">LFO Lobby</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Cari lawan</p>
          </Link>

          {/* Create Team */}
          <Link
            href="/team/create"
            className="glass-card p-4 flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--tier-mythic)]/10 flex items-center justify-center mb-3">
              <Users size={22} className="text-[var(--tier-mythic)]" strokeWidth={2} />
            </div>
            <h3 className="text-title mb-0.5">Buat Tim</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Daftar tim baru</p>
          </Link>
        </motion.div>

        {/* Season Info Card */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-title">Season 1</h2>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                1 Jan 2025 - 28 Feb 2025
              </p>
            </div>
            <span className="px-3 py-1 bg-[var(--color-toxic)]/15 text-[var(--color-toxic)] text-[11px] font-semibold rounded-full uppercase tracking-wide">
              Active
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[var(--color-toxic)]"
                initial={{ width: 0 }}
                animate={{ width: "35%" }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-secondary)]">Progress</span>
              <span className="font-mono font-medium text-[var(--color-toxic)]">35%</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-3 text-center">
            <p className="text-score-sm text-[var(--color-toxic)]">23</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">Tim Aktif</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-score-sm text-[var(--tier-legend)]">156</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">Match</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-score-sm text-[var(--text-primary)]">5</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">LFO</p>
          </div>
        </motion.div>

        {/* Recent Matches Preview */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-title">Match Terbaru</h2>
            <Link href="/match/history" className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>

          {/* Match Card */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--tier-mythic)]/20 flex items-center justify-center text-[14px]">
                  DM
                </div>
                <div>
                  <p className="text-title text-[14px]">Duo Maut</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">vs Padel Bros</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-data text-[var(--tier-epic)]">W 6-4</p>
                <p className="text-[10px] text-[var(--text-tertiary)]">2 jam lalu</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
