"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Users,
  Trophy,
  Bell,
  Calendar,
  MessageSquare,
  Gamepad2,
  Star,
  Heart,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { scaleVariants } from "@/lib/animations"

type EmptyStateType =
  | "search"
  | "teams"
  | "matches"
  | "notifications"
  | "calendar"
  | "messages"
  | "lobby"
  | "achievements"
  | "favorites"
  | "generic"

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  message?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const defaultContent: Record<
  EmptyStateType,
  { icon: ReactNode; title: string; message: string }
> = {
  search: {
    icon: <Search className="w-12 h-12" />,
    title: "Tidak Ada Hasil",
    message: "Coba kata kunci lain atau ubah filter pencarian kamu.",
  },
  teams: {
    icon: <Users className="w-12 h-12" />,
    title: "Belum Ada Tim",
    message: "Buat tim baru atau cari partner untuk memulai!",
  },
  matches: {
    icon: <Trophy className="w-12 h-12" />,
    title: "Belum Ada Pertandingan",
    message: "Mulai tantang tim lain untuk main bareng!",
  },
  notifications: {
    icon: <Bell className="w-12 h-12" />,
    title: "Tidak Ada Notifikasi",
    message: "Kamu akan mendapat notifikasi saat ada update baru.",
  },
  calendar: {
    icon: <Calendar className="w-12 h-12" />,
    title: "Jadwal Kosong",
    message: "Belum ada pertandingan yang dijadwalkan.",
  },
  messages: {
    icon: <MessageSquare className="w-12 h-12" />,
    title: "Belum Ada Pesan",
    message: "Mulai chat dengan tim lain untuk koordinasi.",
  },
  lobby: {
    icon: <Gamepad2 className="w-12 h-12" />,
    title: "Lobby Kosong",
    message: "Jadilah yang pertama mencari match!",
  },
  achievements: {
    icon: <Star className="w-12 h-12" />,
    title: "Belum Ada Achievement",
    message: "Main lebih banyak untuk unlock achievement keren!",
  },
  favorites: {
    icon: <Heart className="w-12 h-12" />,
    title: "Belum Ada Favorit",
    message: "Simpan tim favoritmu untuk akses cepat.",
  },
  generic: {
    icon: <Zap className="w-12 h-12" />,
    title: "Tidak Ada Data",
    message: "Belum ada data yang tersedia saat ini.",
  },
}

export function EmptyState({
  type = "generic",
  title,
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const defaults = defaultContent[type]

  return (
    <motion.div
      variants={scaleVariants}
      initial="initial"
      animate="enter"
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {/* Icon with glow effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-atomic-purple/10 blur-2xl scale-150" />

        {/* Icon container */}
        <div className="relative w-24 h-24 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-[var(--text-secondary)]">
          {icon || defaults.icon}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-white mb-2"
      >
        {title || defaults.title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] max-w-xs mb-6"
      >
        {message || defaults.message}
      </motion.p>

      {/* Action button */}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-atomic-purple rounded-xl font-semibold hover:bg-opacity-80 transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

// Compact empty state for inline use
interface CompactEmptyStateProps {
  message: string
  icon?: ReactNode
  className?: string
}

export function CompactEmptyState({
  message,
  icon,
  className,
}: CompactEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-8 text-[var(--text-secondary)]",
        className
      )}
    >
      {icon && <span className="opacity-50">{icon}</span>}
      <span className="text-sm">{message}</span>
    </div>
  )
}

// No search results with search term
interface NoSearchResultsProps {
  query: string
  onClear?: () => void
  className?: string
}

export function NoSearchResults({
  query,
  onClear,
  className,
}: NoSearchResultsProps) {
  return (
    <EmptyState
      type="search"
      title={`Tidak ada hasil untuk "${query}"`}
      message="Coba kata kunci lain atau periksa ejaan."
      action={onClear ? { label: "Hapus Pencarian", onClick: onClear } : undefined}
      className={className}
    />
  )
}
