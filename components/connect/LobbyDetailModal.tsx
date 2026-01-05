"use client"

import { useState } from "react"
import { ArrowLeft, MessageCircle, UserPlus } from "lucide-react"
import { Lobby } from "@/types"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { DetailsTab } from "./LobbyDetailTabs/DetailsTab"
import { ChatTab } from "./LobbyDetailTabs/ChatTab"

interface LobbyDetailModalProps {
  lobby: Lobby
  isOpen: boolean
  onClose: () => void
  currentUserId: string
}

type TabType = "details" | "chat"

const TABS: { id: TabType; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "chat", label: "Chat" },
]

export function LobbyDetailModal({
  lobby,
  isOpen,
  onClose,
  currentUserId,
}: LobbyDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("details")

  const isHost = lobby.hostId === currentUserId
  const isConfirmed = lobby.confirmedPlayers.some((p) => p.id === currentUserId)
  const hasRequested = lobby.requestedPlayers.some((p) => p.id === currentUserId)
  const isParticipant = isHost || isConfirmed
  const isFull = lobby.confirmedPlayers.length >= lobby.maxPlayers

  const handleAcceptPlayer = (playerId: string) => {
    console.log("Accept player:", playerId)
    // TODO: Implement with actual state management
  }

  const handleRejectPlayer = (playerId: string) => {
    console.log("Reject player:", playerId)
    // TODO: Implement with actual state management
  }

  const handleRequestToJoin = () => {
    console.log("Request to join lobby:", lobby.id)
    // TODO: Implement with actual state management
  }

  const handleWhatsAppHost = () => {
    if (lobby.hostPhone) {
      window.open(`https://wa.me/${lobby.hostPhone}`, '_blank')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[var(--bg-main)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 glass-elevated">
            <div
              className="max-w-[var(--content-max-width)] mx-auto py-3"
              style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
            >
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-[var(--bg-input)] flex items-center justify-center text-[var(--text-primary)]"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div className="flex-1">
                  <h1 className="font-bold text-lg truncate text-[var(--text-primary)]">{lobby.customTitle}</h1>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {lobby.confirmedPlayers.length}/{lobby.maxPlayers} players
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-shrink-0 h-9 px-4 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="max-w-[var(--content-max-width)] mx-auto py-4 pb-32 overflow-y-auto"
            style={{
              paddingLeft: 'var(--page-padding)',
              paddingRight: 'var(--page-padding)',
              height: 'calc(100vh - 120px)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "details" && (
                  <DetailsTab
                    lobby={lobby}
                    isHost={isHost}
                    currentUserId={currentUserId}
                    onAccept={handleAcceptPlayer}
                    onReject={handleRejectPlayer}
                  />
                )}
                {activeTab === "chat" && (
                  <ChatTab
                    lobby={lobby}
                    currentUserId={currentUserId}
                    isParticipant={isParticipant}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Footer Actions */}
          {!isHost && lobby.status !== "FINISHED" && (
            <div className="fixed bottom-0 left-0 right-0 z-20 glass-elevated border-t border-[var(--border-light)]">
              <div
                className="max-w-[var(--content-max-width)] mx-auto py-4 flex gap-3"
                style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
              >
                {/* WhatsApp Host Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppHost}
                  className="flex-1 h-12 rounded-xl glass-card text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp host
                </motion.button>

                {/* Request to Join / Status Button */}
                {isConfirmed ? (
                  <div className="flex-1 h-12 rounded-xl bg-[var(--color-toxic)]/20 text-[var(--color-toxic)] text-sm font-semibold flex items-center justify-center">
                    You're in!
                  </div>
                ) : hasRequested ? (
                  <div className="flex-1 h-12 rounded-xl bg-[var(--tier-legend)]/20 text-[var(--tier-legend)] text-sm font-semibold flex items-center justify-center">
                    Request pending...
                  </div>
                ) : isFull ? (
                  <div className="flex-1 h-12 rounded-xl bg-[var(--bg-input)] text-[var(--text-secondary)] text-sm font-semibold flex items-center justify-center">
                    Lobby full
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestToJoin}
                    className="flex-1 h-12 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} />
                    {lobby.type === "LEAGUE" ? "Request as team" : "Request to join"}
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
