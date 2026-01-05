"use client"

import { useState } from "react"
import { Send, Lock } from "lucide-react"
import { Lobby, LobbyMessage } from "@/types"
import { motion } from "framer-motion"

interface ChatTabProps {
  lobby: Lobby
  currentUserId: string
  isParticipant: boolean
}

// Mock chat messages
const mockMessages: LobbyMessage[] = [
  {
    id: "msg-001",
    lobbyId: "lobby-001",
    userId: "u001",
    userName: "Andi Wijaya",
    content: "Hey semua, ready ya jam 8!",
    createdAt: "2026-01-05T19:00:00Z",
  },
  {
    id: "msg-002",
    lobbyId: "lobby-001",
    userId: "u002",
    userName: "Budi Santoso",
    content: "Siap bos! 👍",
    createdAt: "2026-01-05T19:02:00Z",
  },
  {
    id: "msg-003",
    lobbyId: "lobby-001",
    userId: "u003",
    userName: "Citra Dewi",
    content: "Otw sekarang, mungkin 10 menit lagi sampai",
    createdAt: "2026-01-05T19:45:00Z",
  },
]

export function ChatTab({ lobby, currentUserId, isParticipant }: ChatTabProps) {
  const [message, setMessage] = useState("")

  const formatTime = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleSend = () => {
    if (!message.trim()) return
    // In real app, this would send to backend
    console.log("Sending message:", message)
    setMessage("")
  }

  // Chat only accessible to confirmed participants
  if (!isParticipant) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Lock size={24} className="text-[var(--text-tertiary)]" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Chat is locked</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-[240px]">
          Only confirmed participants can access the lobby chat.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {mockMessages
          .filter((m) => m.lobbyId === lobby.id || true) // Mock: show all messages
          .map((msg) => {
            const isOwn = msg.userId === currentUserId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${isOwn ? "order-2" : ""}`}>
                  {!isOwn && (
                    <p className="text-[10px] text-[var(--text-tertiary)] mb-1 px-1">
                      {msg.userName}
                    </p>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      isOwn
                        ? "bg-[var(--color-toxic)] text-black rounded-br-sm"
                        : "glass-card rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className={`text-[10px] text-[var(--text-tertiary)] mt-1 ${
                    isOwn ? "text-right" : ""
                  } px-1`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-11 px-4 rounded-xl glass-card border-0 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!message.trim()}
          className="w-11 h-11 rounded-xl bg-[var(--color-toxic)] text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  )
}
