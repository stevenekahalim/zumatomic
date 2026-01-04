"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: "primary" | "white" | "secondary" | "dark"
  className?: string
}

const sizes = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-[3px]",
}

const colors = {
  primary: "border-[var(--color-toxic)]/30 border-t-[var(--color-toxic)]",
  white: "border-white/30 border-t-white",
  secondary: "border-white/10 border-t-[var(--text-secondary)]",
  dark: "border-black/20 border-t-[var(--bg-void)]",
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizes[size],
        colors[color],
        className
      )}
    />
  )
}

// Full page loading overlay
interface LoadingOverlayProps {
  message?: string
  blur?: boolean
}

export function LoadingOverlay({
  message = "Memuat...",
  blur = true,
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-void)]/80",
        blur && "backdrop-blur-sm"
      )}
    >
      <LoadingSpinner size="xl" />
      {message && (
        <p className="mt-4 text-[var(--text-secondary)] text-sm">{message}</p>
      )}
    </motion.div>
  )
}

// Inline loading for sections
interface LoadingSectionProps {
  className?: string
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSection({
  className,
  message,
  size = "md",
}: LoadingSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
    >
      <LoadingSpinner size={size === "sm" ? "md" : size === "md" ? "lg" : "xl"} />
      {message && (
        <p className="mt-4 text-[var(--text-secondary)] text-sm">{message}</p>
      )}
    </div>
  )
}

// Button loading state component
interface ButtonLoaderProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ButtonLoader({
  isLoading,
  children,
  loadingText = "Loading...",
}: ButtonLoaderProps) {
  if (!isLoading) return <>{children}</>

  return (
    <span className="flex items-center justify-center gap-2">
      <LoadingSpinner size="sm" color="white" />
      {loadingText}
    </span>
  )
}

// Pulsing logo loader (brand-specific - Nocturnal Stadium)
export function ZumatomicLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Toxic glow */}
        <div className="absolute inset-0 rounded-full bg-[var(--color-toxic)]/30 blur-xl animate-pulse" />

        {/* Logo container */}
        <div className="relative w-16 h-16 rounded-2xl bg-[var(--color-toxic)] flex items-center justify-center shadow-[var(--glow-toxic)]">
          <span className="text-2xl font-bold text-[var(--bg-void)]">Z</span>
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4 text-sm text-[var(--text-secondary)] font-semibold tracking-wider"
      >
        ZUMATOMIC
      </motion.p>
    </div>
  )
}

// Top progress bar (for navigation)
interface TopProgressBarProps {
  progress: number // 0-100
  isAnimating?: boolean
}

export function TopProgressBar({ progress, isAnimating }: TopProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-white/5">
      <motion.div
        className="h-full bg-[var(--color-toxic)]"
        initial={{ width: 0 }}
        animate={{
          width: `${progress}%`,
          ...(isAnimating && {
            x: [0, 10, 0],
          }),
        }}
        transition={{
          width: { duration: 0.3 },
          x: { duration: 1, repeat: Infinity },
        }}
        style={{ boxShadow: 'var(--glow-toxic)' }}
      />
    </div>
  )
}
