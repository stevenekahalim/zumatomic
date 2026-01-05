"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, Zap, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { RecordActionSheet } from "@/components/play/RecordActionSheet"

// New 5-Slot Dock: HOME | FIND GAMES | [RECORD] | LEAGUE | PROFILE
const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Find Games", href: "/connect", icon: Search },
  // RECORD is handled separately as center FAB
  { label: "League", href: "/league", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const [isPlayOpen, setIsPlayOpen] = useState(false)

  // Hide on auth pages
  if (["/login", "/otp", "/register", "/welcome"].some(p => pathname.startsWith(p))) {
    return null
  }

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 glass-elevated"
        style={{ height: 'var(--bottom-nav-height)' }}
      >
        {/* Nav content */}
        <div
          className="relative h-full flex items-center justify-around max-w-[var(--content-max-width)] mx-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Left side nav items (Home, Connect) */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] px-3 py-2 transition-all duration-200",
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--color-primary)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                </div>
                <span className={cn(
                  "text-[10px] transition-all duration-200",
                  isActive ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Center RECORD FAB Button */}
          <div className="relative flex items-center justify-center min-w-[72px]">
            <motion.button
              onClick={() => setIsPlayOpen(true)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative -mt-8 w-14 h-14 rounded-full",
                "bg-[var(--color-primary)] text-white",
                "flex items-center justify-center",
                "shadow-lg",
                "transition-all duration-200"
              )}
            >
              {/* Subtle ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Zap size={26} strokeWidth={2.5} className="relative z-10" />
            </motion.button>
            <span className="absolute -bottom-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
              Record
            </span>
          </div>

          {/* Right side nav items (League, Profile) */}
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] px-3 py-2 transition-all duration-200",
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--color-primary)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                </div>
                <span className={cn(
                  "text-[10px] transition-all duration-200",
                  isActive ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* RECORD Action Sheet */}
      <RecordActionSheet isOpen={isPlayOpen} onClose={() => setIsPlayOpen(false)} />
    </>
  )
}
