"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  scale: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  pieceCount?: number
  className?: string
}

const colors = [
  "#8B5CF6", // atomic-purple
  "#EC4899", // atomic-pink
  "#06B6D4", // atomic-cyan
  "#FBBF24", // atomic-yellow
  "#10B981", // atomic-green
]

export function Confetti({
  isActive,
  duration = 3000,
  pieceCount = 50,
  className,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }).map(
        (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        })
      )
      setPieces(newPieces)

      const timer = setTimeout(() => {
        setPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, pieceCount, duration])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none overflow-hidden z-[100]",
            className
          )}
        >
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                y: "-10vh",
                x: `${piece.x}vw`,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: 10 * piece.scale,
                height: 10 * piece.scale,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

// Celebration modal with confetti
interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  message,
  icon,
  actionLabel = "Lanjut",
  onAction,
}: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Confetti isActive={isOpen} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon with glow */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative w-20 h-20 mx-auto mb-6"
              >
                <div className="absolute inset-0 bg-atomic-purple/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-4xl">
                  {icon || "🎉"}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2 gradient-text"
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--text-secondary)] mb-8"
              >
                {message}
              </motion.p>

              {/* Action button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onAction?.()
                  onClose()
                }}
                className="w-full py-3 bg-atomic-purple rounded-xl font-semibold hover:bg-opacity-80 transition-colors"
              >
                {actionLabel}
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Small sparkle effect for badges/achievements
interface SparkleProps {
  isActive: boolean
  className?: string
}

export function Sparkle({ isActive, className }: SparkleProps) {
  if (!isActive) return null

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-atomic-yellow"
        />
      ))}
    </div>
  )
}
