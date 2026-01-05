"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { X, Zap, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { SparringFormModal } from "@/components/match/SparringFormModal"

interface PlayActionSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function PlayActionSheet({ isOpen, onClose }: PlayActionSheetProps) {
  const router = useRouter()
  const [showSparringForm, setShowSparringForm] = useState(false)

  const handleSparringClick = () => {
    onClose()
    // Small delay to allow sheet to close before opening modal
    setTimeout(() => setShowSparringForm(true), 200)
  }

  const handleNavigation = (href: string) => {
    onClose()
    router.push(href)
  }

  const playActions = [
    {
      id: "sparring",
      label: "Input Skor Sparring",
      description: "Casual match - Update MMR only",
      icon: Zap,
      color: "var(--color-toxic)",
      onClick: handleSparringClick,
    },
    {
      id: "broadcast",
      label: "Broadcast LFO",
      description: "Cari lawan tanding",
      icon: Megaphone,
      color: "var(--tier-legend)",
      href: "/play/broadcast",
    },
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] max-h-[80vh] rounded-t-3xl bg-[var(--bg-card)] border-t border-white/10"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Play</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Pilih aksi</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Action Cards */}
              <div className="px-4 pb-6 space-y-3">
                {playActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => action.onClick ? action.onClick() : handleNavigation(action.href!)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl",
                        "glass-card hover:bg-white/10 transition-all",
                        "text-left"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${action.color} 20%, transparent)`,
                          boxShadow: `0 0 20px ${action.color}30`,
                        }}
                      >
                        <Icon size={24} style={{ color: action.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{action.label}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {action.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="text-[var(--text-tertiary)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Hint */}
              <div className="px-6 pb-8">
                <p className="text-center text-xs text-[var(--text-tertiary)]">
                  Untuk match liga official, gunakan menu di tab League
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sparring Form Modal */}
      <SparringFormModal
        isOpen={showSparringForm}
        onClose={() => setShowSparringForm(false)}
      />
    </>
  )
}
