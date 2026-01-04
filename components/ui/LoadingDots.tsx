"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white" | "secondary"
  className?: string
}

const sizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
}

const colors = {
  primary: "bg-atomic-purple",
  white: "bg-white",
  secondary: "bg-[var(--text-secondary)]",
}

const dotVariants = {
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [-4, 0, -4],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.1,
      ease: "easeInOut" as const,
    },
  }),
}

export function LoadingDots({
  size = "md",
  color = "primary",
  className,
}: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className={cn("rounded-full", sizes[size], colors[color])}
        />
      ))}
    </div>
  )
}

// Typing indicator (chat-like)
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-4 py-2 bg-dark-card rounded-2xl",
        className
      )}
    >
      <LoadingDots size="sm" color="secondary" />
    </div>
  )
}

// Pulse dots (alternative style)
interface PulseDotsProps {
  className?: string
  color?: "primary" | "white"
}

export function PulseDots({ className, color = "primary" }: PulseDotsProps) {
  const dotColor = color === "primary" ? "bg-atomic-purple" : "bg-white"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className={cn("w-2 h-2 rounded-full", dotColor)}
        />
      ))}
    </div>
  )
}

// Loading text with animated dots
interface LoadingTextProps {
  text?: string
  className?: string
}

export function LoadingText({
  text = "Memuat",
  className,
}: LoadingTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      >
        .
      </motion.span>
    </span>
  )
}
