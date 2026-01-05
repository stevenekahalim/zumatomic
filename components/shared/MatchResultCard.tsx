"use client"

import { MapPin, Trophy } from "lucide-react"
import { motion } from "framer-motion"

// Types
interface MatchPlayer {
  id: string
  name: string
  avatar?: string
  mmr: number
}

interface MatchTeam {
  name?: string // Team name (for LEAGUE matches)
  players: MatchPlayer[]
}

interface MatchSet {
  scoreA: number | null
  scoreB: number | null
}

export interface MatchResultData {
  id: string
  date: string        // "2026-01-05"
  time: string        // "20:00"
  type: "RANKED" | "LEAGUE"
  venue?: string      // "PALAS Tennis Club"
  teamA: MatchTeam
  teamB: MatchTeam
  sets: MatchSet[]
  winner: "A" | "B" | null
}

interface MatchResultCardProps {
  match: MatchResultData
  onClick?: () => void
}

// Player Slot Component
function PlayerSlot({ player }: { player: MatchPlayer }) {
  return (
    <div className="flex flex-col items-center w-[56px]">
      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-sm font-medium text-white">
        {player.avatar ? (
          <img
            src={player.avatar}
            alt={player.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          player.name.charAt(0).toUpperCase()
        )}
      </div>
      <span className="text-[11px] text-[var(--text-primary)] mt-1 truncate max-w-[56px] font-medium">
        {player.name.split(' ')[0]}
      </span>
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white font-semibold mt-0.5">
        {player.mmr.toFixed(1)}
      </span>
    </div>
  )
}

// Team Row Component
function TeamRow({
  team,
  sets,
  isWinner,
  side,
  isLeague
}: {
  team: MatchTeam
  sets: MatchSet[]
  isWinner: boolean
  side: "A" | "B"
  isLeague: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2">
      {/* Left: Team/Players */}
      <div className="flex flex-col">
        {/* Team Name (LEAGUE only) */}
        {isLeague && team.name && (
          <span className="text-[11px] font-semibold text-[var(--tier-legend)] mb-1 uppercase tracking-wide">
            {team.name}
          </span>
        )}
        {/* Players */}
        <div className="flex gap-2">
          {team.players.map((player) => (
            <PlayerSlot key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* Right: Trophy + Set Scores */}
      <div className="flex items-center gap-2">
        {isWinner && (
          <Trophy size={20} className="text-[var(--tier-legend)]" />
        )}
        <div className="flex items-center gap-3">
          {sets.map((set, i) => {
            const score = side === "A" ? set.scoreA : set.scoreB
            return (
              <span
                key={i}
                className="text-2xl font-mono font-bold text-[var(--text-primary)] w-6 text-center"
              >
                {score !== null ? score : "-"}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Main Component
export function MatchResultCard({ match, onClick }: MatchResultCardProps) {
  // Format date to readable format
  const formatDateTime = (dateStr: string, timeStr: string) => {
    const d = new Date(dateStr)
    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    // Format time from "20:00" to "8:00 pm"
    const [hours, minutes] = timeStr.split(":").map(Number)
    const period = hours >= 12 ? "pm" : "am"
    const displayHours = hours % 12 || 12
    const timeFormatted = `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`

    return `${dateFormatted} | ${timeFormatted}`
  }

  const isLeague = match.type === "LEAGUE"

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full glass-card rounded-2xl p-4 text-left"
    >
      {/* Header: Date/Time */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-[var(--text-secondary)]">
          {formatDateTime(match.date, match.time)}
        </span>
      </div>

      {/* Team A Row */}
      <TeamRow
        team={match.teamA}
        sets={match.sets}
        isWinner={match.winner === "A"}
        side="A"
        isLeague={isLeague}
      />

      {/* Team B Row */}
      <TeamRow
        team={match.teamB}
        sets={match.sets}
        isWinner={match.winner === "B"}
        side="B"
        isLeague={isLeague}
      />

      {/* Footer: Venue */}
      {match.venue && (
        <div className="mt-3 pt-3 border-t border-[var(--border-light)] flex items-center gap-1.5">
          <MapPin size={12} className="text-[var(--text-tertiary)]" />
          <span className="text-xs text-[var(--text-secondary)]">{match.venue}</span>
        </div>
      )}
    </motion.button>
  )
}
