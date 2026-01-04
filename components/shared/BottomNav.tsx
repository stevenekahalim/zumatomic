"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Trophy, Swords, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Ranking", href: "/leaderboard", icon: Trophy },
  { label: "Lobby", href: "/lobby", icon: Swords },
  { label: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide on auth pages
  if (["/login", "/otp", "/register", "/welcome"].some(p => pathname.startsWith(p))) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-elevated"
      style={{ height: 'var(--bottom-nav-height)' }}
    >
      {/* Nav content */}
      <div
        className="relative h-full flex items-center justify-around max-w-[var(--content-max-width)] mx-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 min-w-[72px] min-h-[48px] px-4 py-2 transition-all duration-200",
                isActive ? "text-[var(--color-toxic)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--color-toxic)]"
                  style={{ boxShadow: 'var(--glow-toxic)' }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
              </div>

              {/* Label */}
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
  )
}
