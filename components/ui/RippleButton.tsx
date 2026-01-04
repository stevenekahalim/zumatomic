"use client"

import { useState, useRef, ReactNode } from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./LoadingSpinner"
import { Check } from "lucide-react"

interface RipplePosition {
  x: number
  y: number
  id: number
}

interface RippleButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  isSuccess?: boolean
  loadingText?: string
  successText?: string
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const variants = {
  primary:
    "bg-[var(--color-toxic)] text-[var(--bg-void)] hover:opacity-90 active:opacity-95 shadow-[var(--glow-toxic)]",
  secondary: "glass-card text-white hover:bg-white/10",
  outline:
    "bg-transparent border border-[var(--color-toxic)] text-[var(--color-toxic)] hover:bg-[var(--color-toxic)]/10",
  ghost: "bg-transparent text-white hover:bg-white/10",
  danger: "bg-[var(--color-error)] text-white hover:brightness-110",
}

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-full",
}

export function RippleButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  isSuccess = false,
  loadingText,
  successText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<RipplePosition[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleIdRef = useRef(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled || isLoading) return

    // Create ripple effect
    const button = buttonRef.current
    if (button) {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newRipple = {
        x,
        y,
        id: rippleIdRef.current++,
      }

      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    }

    if (onClick) {
      onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
    }
  }

  const isDisabled = disabled || isLoading

  return (
    <motion.button
      ref={buttonRef}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "relative overflow-hidden font-semibold transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toxic)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-void)]",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "absolute rounded-full pointer-events-none",
              variant === "primary" ? "bg-black/20" : "bg-white/30"
            )}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" color={variant === "primary" ? "dark" : "white"} />
            {loadingText || children}
          </>
        ) : isSuccess ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-5 h-5" />
            </motion.span>
            {successText || "Berhasil!"}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </span>
    </motion.button>
  )
}

// Icon button variant
interface IconButtonProps {
  icon: ReactNode
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "ghost" | "danger"
  "aria-label": string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

const iconSizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
}

export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={!disabled ? { scale: 0.9 } : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toxic)]",
        iconSizes[size],
        variant === "primary" && "bg-[var(--color-toxic)] text-[var(--bg-void)] hover:opacity-80 shadow-[var(--glow-toxic)]",
        variant === "secondary" && "glass-card hover:bg-white/10",
        variant === "ghost" && "hover:bg-white/10 text-[var(--text-secondary)] hover:text-white",
        variant === "danger" && "text-[var(--color-error)] hover:bg-[var(--color-error)]/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {icon}
    </motion.button>
  )
}

// Floating Action Button
interface FABProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: ReactNode
  label?: string
  extended?: boolean
}

export function FAB({
  icon,
  label,
  extended = false,
  className,
  ...props
}: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed bottom-24 right-4 z-40",
        "bg-[var(--color-toxic)]",
        "text-[var(--bg-void)] font-semibold shadow-[var(--glow-toxic-intense)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toxic)]",
        extended
          ? "px-6 py-3 rounded-full flex items-center gap-2"
          : "w-14 h-14 rounded-full flex items-center justify-center",
        className
      )}
      {...props}
    >
      {icon}
      {extended && label && <span>{label}</span>}
    </motion.button>
  )
}

// Toggle button
interface ToggleButtonProps {
  isActive: boolean
  onToggle: () => void
  activeLabel?: string
  inactiveLabel?: string
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  className?: string
}

export function ToggleButton({
  isActive,
  onToggle,
  activeLabel,
  inactiveLabel,
  activeIcon,
  inactiveIcon,
  className,
}: ToggleButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-colors",
        "flex items-center gap-2",
        isActive
          ? "bg-[var(--color-toxic)] text-[var(--bg-void)]"
          : "glass-card text-[var(--text-secondary)]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isActive ? "active" : "inactive"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {isActive ? activeIcon : inactiveIcon}
        </motion.span>
      </AnimatePresence>
      {isActive ? activeLabel : inactiveLabel}
    </motion.button>
  )
}
