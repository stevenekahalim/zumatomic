"use client"

import { useState, useMemo } from "react"
import { Filter, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Lobby } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { LobbyCard } from "@/components/connect/LobbyCard"
import { LobbyDateHeader } from "@/components/connect/LobbyDateHeader"
import { LobbyDetailModal } from "@/components/connect/LobbyDetailModal"
import { CreateLobbyModal } from "@/components/connect/CreateLobbyModal"
import lobbiesData from "@/data/mock/lobbies.json"

type ViewType = "open" | "past"
type FilterType = "ALL" | "RANKED" | "LEAGUE"

// Mock current user
const CURRENT_USER_ID = "u001"

export default function ConnectPage() {
  const [activeView, setActiveView] = useState<ViewType>("open")
  const [typeFilter, setTypeFilter] = useState<FilterType>("ALL")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedLobby, setSelectedLobby] = useState<Lobby | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [lobbies, setLobbies] = useState<Lobby[]>(lobbiesData as Lobby[])

  // Separate open and past lobbies
  const today = new Date().toISOString().split("T")[0]
  const openLobbies = lobbies.filter((l) => l.status !== "FINISHED" && l.date >= today)
  const pastLobbies = lobbies.filter((l) => l.status === "FINISHED" || l.date < today)

  // Apply type filter
  const filteredLobbies = useMemo(() => {
    const baseLobbies = activeView === "open" ? openLobbies : pastLobbies
    if (typeFilter === "ALL") return baseLobbies
    return baseLobbies.filter((l) => l.type === typeFilter)
  }, [activeView, typeFilter, openLobbies, pastLobbies])

  // Group lobbies by date
  const groupedLobbies = useMemo(() => {
    const groups: { [date: string]: Lobby[] } = {}
    filteredLobbies.forEach((lobby) => {
      if (!groups[lobby.date]) {
        groups[lobby.date] = []
      }
      groups[lobby.date].push(lobby)
    })
    // Sort by date (ascending for open, descending for past)
    const sortedDates = Object.keys(groups).sort((a, b) =>
      activeView === "open"
        ? new Date(a).getTime() - new Date(b).getTime()
        : new Date(b).getTime() - new Date(a).getTime()
    )
    return sortedDates.map((date) => ({
      date,
      lobbies: groups[date].sort((a, b) => a.time.localeCompare(b.time)),
    }))
  }, [filteredLobbies, activeView])

  const handleLobbyClick = (lobby: Lobby) => {
    setSelectedLobby(lobby)
  }

  const handleCreateLobby = (data: {
    type: "RANKED" | "LEAGUE"
    customTitle: string
    date: string
    time: string
    duration: number
    locationType: "VENUE" | "FLEXIBLE"
    locationName: string
    minMmr?: number
    maxMmr?: number
    notes: string
  }) => {
    // Create new lobby (mock)
    const newLobby: Lobby = {
      id: `lobby-${Date.now()}`,
      type: data.type,
      customTitle: data.customTitle,
      hostId: CURRENT_USER_ID,
      hostName: "Andi Wijaya", // Mock user name
      date: data.date,
      time: data.time,
      duration: data.duration,
      locationType: data.locationType,
      locationName: data.locationName,
      minMmr: data.minMmr,
      maxMmr: data.maxMmr,
      maxPlayers: 4,
      confirmedPlayers: [
        { id: CURRENT_USER_ID, name: "Andi Wijaya", mmr: 4.25, team: "A" }
      ],
      requestedPlayers: [],
      status: "OPEN",
      notes: data.notes,
      createdAt: new Date().toISOString(),
    }

    setLobbies((prev) => [newLobby, ...prev])
    setShowCreateModal(false)
  }

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div className="sticky top-[var(--header-height)] z-30 glass-elevated">
        <div
          className="max-w-[var(--content-max-width)] mx-auto py-4"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-[20px]">Find Games</h1>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Join a lobby or create your own
              </p>
            </div>
          </div>

          {/* Toggle + Filter Row */}
          <div className="flex items-center justify-between">
            {/* Open/Past Toggle */}
            <div className="flex gap-2 p-1 glass-card rounded-xl">
              <button
                onClick={() => setActiveView("open")}
                className={cn(
                  "h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  activeView === "open"
                    ? "bg-[var(--color-toxic)] text-black"
                    : "text-[var(--text-secondary)] hover:text-white"
                )}
              >
                Open
                <span className={cn(
                  "text-xs font-bold",
                  activeView === "open" ? "text-black/60" : "text-[var(--text-tertiary)]"
                )}>
                  {openLobbies.length}
                </span>
              </button>
              <button
                onClick={() => setActiveView("past")}
                className={cn(
                  "h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  activeView === "past"
                    ? "bg-[var(--color-toxic)] text-black"
                    : "text-[var(--text-secondary)] hover:text-white"
                )}
              >
                Past
                <span className={cn(
                  "text-xs font-bold",
                  activeView === "past" ? "text-black/60" : "text-[var(--text-tertiary)]"
                )}>
                  {pastLobbies.length}
                </span>
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                showFilter || typeFilter !== "ALL"
                  ? "bg-[var(--color-toxic)]/20 text-[var(--color-toxic)]"
                  : "glass-card text-[var(--text-secondary)]"
              )}
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mt-3">
                  {(["ALL", "RANKED", "LEAGUE"] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTypeFilter(filter)}
                      className={cn(
                        "flex-1 h-9 rounded-lg text-sm font-medium transition-all",
                        typeFilter === filter
                          ? filter === "LEAGUE"
                            ? "bg-[var(--tier-legend)] text-black"
                            : "bg-[var(--color-toxic)] text-black"
                          : "glass-card text-[var(--text-secondary)]"
                      )}
                    >
                      {filter === "ALL" ? "All Types" : filter}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-[var(--content-max-width)] mx-auto py-4"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        <AnimatePresence mode="wait">
          {groupedLobbies.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <Filter size={24} className="text-[var(--text-tertiary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No lobbies found</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {activeView === "open"
                  ? "Be the first to create a lobby!"
                  : "No past lobbies to show."
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="lobbies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groupedLobbies.map((group, groupIndex) => (
                <div key={group.date} className="mb-6">
                  {/* Sticky Date Header */}
                  <LobbyDateHeader date={group.date} />

                  {/* Lobby Cards */}
                  <div className="space-y-3 mt-2">
                    {group.lobbies.map((lobby, index) => (
                      <motion.div
                        key={lobby.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                      >
                        <LobbyCard
                          lobby={lobby}
                          onClick={() => handleLobbyClick(lobby)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB - Create Lobby */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed right-5 bottom-[calc(var(--nav-height)+24px)] w-14 h-14 rounded-full bg-[var(--color-toxic)] text-black shadow-lg flex items-center justify-center z-40"
      >
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Lobby Detail Modal */}
      {selectedLobby && (
        <LobbyDetailModal
          lobby={selectedLobby}
          isOpen={!!selectedLobby}
          onClose={() => setSelectedLobby(null)}
          currentUserId={CURRENT_USER_ID}
        />
      )}

      {/* Create Lobby Modal */}
      <CreateLobbyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLobby}
      />
    </div>
  )
}
