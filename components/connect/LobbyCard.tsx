"use client"

import { MapPin, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Lobby, LobbyPlayer } from "@/types"
import { motion } from "framer-motion"

interface LobbyCardProps {
  lobby: Lobby
  onClick?: () => void
}

// Helper: Get players by team
function getTeamPlayers(players: LobbyPlayer[], team: "A" | "B"): (LobbyPlayer | null)[] {
  const teamPlayers = players.filter(p => p.team === team)
  return [teamPlayers[0] || null, teamPlayers[1] || null]
}

// Player Slot Component
function PlayerSlot({ player }: { player: LobbyPlayer | null }) {
  if (!player) {
    return (
      <div className="flex flex-col items-center w-[56px]">
        <div className="w-9 h-9 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
          <Plus size={14} className="text-white/40" />
        </div>
        <span className="text-[9px] text-[var(--text-tertiary)] mt-1">Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-[56px]">
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
        {player.avatar ? (
          <img src={player.avatar} alt={player.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          player.name.charAt(0).toUpperCase()
        )}
      </div>
      <span className="text-[10px] text-white mt-1 truncate max-w-[56px]">
        {player.name.split(' ')[0]}
      </span>
      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[var(--color-toxic)]/20 text-[var(--color-toxic)] font-medium">
        {player.mmr.toFixed(1)}
      </span>
    </div>
  )
}

export function LobbyCard({ lobby, onClick }: LobbyCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const teamA = getTeamPlayers(lobby.confirmedPlayers, "A")
  const teamB = getTeamPlayers(lobby.confirmedPlayers, "B")
  const isLeague = lobby.type === "LEAGUE"

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full glass-card rounded-2xl p-4 text-left"
    >
      {/* Row 1: Title */}
      <h3 className="font-semibold text-[15px] text-white mb-1 line-clamp-1">
        {lobby.customTitle}
      </h3>

      {/* Row 2: Time + Duration + Type + MMR Range */}
      <div className="flex items-center gap-2 text-[12px] mb-3">
        <span className="text-[var(--color-toxic)] font-bold">
          {formatTime(lobby.time)}
        </span>
        <span className="text-[var(--text-tertiary)]">·</span>
        <span className="text-[var(--text-secondary)]">{lobby.duration}h</span>
        <span className="text-[var(--text-tertiary)]">·</span>
        <span className={cn(
          "font-semibold uppercase text-[10px]",
          isLeague ? "text-[var(--tier-legend)]" : "text-[var(--text-secondary)]"
        )}>
          {lobby.type}
        </span>
        {isLeague && lobby.minMmr && lobby.maxMmr && (
          <>
            <span className="flex-1" />
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {lobby.minMmr} - {lobby.maxMmr}
            </span>
          </>
        )}
      </div>

      {/* Row 3: Team Labels (LEAGUE only) */}
      {isLeague && (
        <div className="flex items-center mb-1">
          <span className="flex-1 text-[10px] text-[var(--tier-legend)] font-medium text-center">
            {lobby.teamName || "Team A"}
          </span>
          <div className="w-px" />
          <span className="flex-1 text-[10px] text-[var(--text-tertiary)] text-center">
            —
          </span>
        </div>
      )}

      {/* Row 4: Player Slots (2v2) */}
      <div className="flex items-start justify-center gap-2">
        {/* Team A */}
        <div className="flex gap-1">
          <PlayerSlot player={teamA[0]} />
          <PlayerSlot player={teamA[1]} />
        </div>

        {/* Divider */}
        <div className="h-14 w-px bg-white/10 mx-1" />

        {/* Team B */}
        <div className="flex gap-1">
          <PlayerSlot player={teamB[0]} />
          <PlayerSlot player={teamB[1]} />
        </div>
      </div>

      {/* Row 5: Location + Host */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
          <MapPin size={12} className="text-[var(--text-tertiary)]" />
          <span className="truncate">{lobby.locationName}</span>
        </div>
        <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
          Host: <span className="text-[var(--text-secondary)]">{lobby.hostName}</span>
        </p>
      </div>
    </motion.button>
  )
}
