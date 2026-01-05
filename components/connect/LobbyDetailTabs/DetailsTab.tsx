"use client"

import { Calendar, MapPin, Swords, ExternalLink, Check, X, User } from "lucide-react"
import { Lobby, LobbyPlayer } from "@/types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DetailsTabProps {
  lobby: Lobby
  isHost: boolean
  currentUserId: string
  onAccept?: (playerId: string) => void
  onReject?: (playerId: string) => void
}

// Player Row Component
function PlayerRow({
  player,
  isHost,
  showHostBadge,
  showActions,
  onAccept,
  onReject,
}: {
  player: LobbyPlayer
  isHost: boolean
  showHostBadge?: boolean
  showActions?: boolean
  onAccept?: () => void
  onReject?: () => void
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 rounded-full bg-[var(--bg-input)] flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">
        {player.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate text-[var(--text-primary)]">{player.name}</p>
          {showHostBadge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium">
              Host
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          MMR {player.mmr.toFixed(2)}
          {player.team && <span className="text-[var(--text-tertiary)]"> • Team {player.team}</span>}
        </p>
      </div>
      {showActions && isHost && (
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAccept}
            className="w-9 h-9 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] flex items-center justify-center"
          >
            <Check size={18} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onReject}
            className="w-9 h-9 rounded-full bg-[var(--color-error)]/20 text-[var(--color-error)] flex items-center justify-center"
          >
            <X size={18} />
          </motion.button>
        </div>
      )}
    </div>
  )
}

export function DetailsTab({ lobby, isHost, currentUserId, onAccept, onReject }: DetailsTabProps) {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Format time from "20:00" to "8:00 PM"
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Participants data
  const teamA = lobby.confirmedPlayers.filter((p) => p.team === "A")
  const teamB = lobby.confirmedPlayers.filter((p) => p.team === "B")
  const unassigned = lobby.confirmedPlayers.filter((p) => !p.team)
  const confirmedCount = lobby.confirmedPlayers.length
  const maxPlayers = lobby.maxPlayers
  const emptySlots = maxPlayers - confirmedCount

  return (
    <div className="space-y-5">
      {/* Title & Time */}
      <div>
        <h2 className="text-xl font-bold mb-1 text-[var(--text-primary)]">{lobby.customTitle}</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {formatDate(lobby.date)} @ {formatTime(lobby.time)}
        </p>
      </div>

      {/* Host Block */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Host</p>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]"
          >
            {lobby.hostName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)]">{lobby.hostName}</p>
            {lobby.teamName && (
              <p className="text-sm text-[var(--tier-legend)]">{lobby.teamName}</p>
            )}
          </div>
          {!isHost && (
            <button className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1">
              Contact <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-3">
        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-[var(--text-secondary)]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--text-primary)]">
              {formatDate(lobby.date)} • {formatTime(lobby.time)} • {lobby.duration} hour(s)
            </p>
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 mt-0.5">
              Add to calendar <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-[var(--text-secondary)]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--text-primary)]">{lobby.locationName}</p>
            {lobby.locationAddress && (
              <p className="text-sm text-[var(--text-secondary)]">{lobby.locationAddress}</p>
            )}
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 mt-0.5">
              Show in maps <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Match Type & Constraints */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] flex items-center justify-center flex-shrink-0">
            <Swords size={18} className="text-[var(--text-secondary)]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--text-primary)]">
              <span className={cn(
                lobby.type === "LEAGUE" ? "text-[var(--tier-legend)]" : "text-[var(--text-primary)]"
              )}>
                {lobby.type}
              </span>
              {(lobby.minMmr || lobby.maxMmr) && (
                <span className="text-[var(--text-secondary)]">
                  {" • "}
                  {lobby.minMmr && `Min MMR ${lobby.minMmr}`}
                  {lobby.minMmr && lobby.maxMmr && " - "}
                  {lobby.maxMmr && `Max MMR ${lobby.maxMmr}`}
                </span>
              )}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {lobby.maxPlayers} players max
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {lobby.notes && (
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{lobby.notes}</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[var(--border-light)]" />

      {/* Participants Section */}
      <div className="space-y-4">
        {/* Confirmed Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Confirmed
            </h3>
            <span className={cn(
              "text-xs font-bold",
              confirmedCount >= maxPlayers ? "text-[var(--color-success)]" : "text-[var(--text-secondary)]"
            )}>
              {confirmedCount}/{maxPlayers}
            </span>
          </div>

          <div className="glass-card rounded-xl p-3 space-y-1">
            {/* Team A */}
            {teamA.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-[var(--tier-legend)] uppercase tracking-wider px-1 pt-1">
                  Team A
                </p>
                {teamA.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    isHost={isHost}
                    showHostBadge={player.id === lobby.hostId}
                  />
                ))}
              </>
            )}

            {/* Team B */}
            {teamB.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-[var(--tier-epic)] uppercase tracking-wider px-1 pt-2">
                  Team B
                </p>
                {teamB.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    isHost={isHost}
                  />
                ))}
              </>
            )}

            {/* Unassigned */}
            {unassigned.length > 0 && (
              <>
                {(teamA.length > 0 || teamB.length > 0) && (
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-1 pt-2">
                    Unassigned
                  </p>
                )}
                {unassigned.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    isHost={isHost}
                    showHostBadge={player.id === lobby.hostId}
                  />
                ))}
              </>
            )}

            {/* Empty Slots */}
            {emptySlots > 0 && (
              <div className="pt-2 space-y-2">
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 py-2 opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full border border-dashed border-[var(--border-medium)] flex items-center justify-center">
                      <User size={16} className="text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-sm text-[var(--text-tertiary)]">Open slot</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requested Section */}
        {lobby.requestedPlayers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Requested
              </h3>
              <span className="text-xs font-bold text-[var(--color-primary)]">
                {lobby.requestedPlayers.length}
              </span>
            </div>

            <div className="glass-card rounded-xl p-3 space-y-1">
              {lobby.requestedPlayers.map((player) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  isHost={isHost}
                  showActions
                  onAccept={() => onAccept?.(player.id)}
                  onReject={() => onReject?.(player.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Requested */}
        {lobby.requestedPlayers.length === 0 && isHost && (
          <div className="text-center py-4 opacity-50">
            <p className="text-sm text-[var(--text-secondary)]">No pending requests</p>
          </div>
        )}
      </div>
    </div>
  )
}
