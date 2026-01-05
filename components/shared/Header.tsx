"use client"

import { Bell, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title?: string
  showLogo?: boolean
  showActions?: boolean
  className?: string
}

export function Header({
  title,
  showLogo = true,
  showActions = true,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]",
        className
      )}
    >
      <div
        className="flex items-center justify-between max-w-[var(--content-max-width)] mx-auto"
        style={{
          height: 'var(--header-height)',
          paddingLeft: 'var(--page-padding)',
          paddingRight: 'var(--page-padding)',
        }}
      >
        {showLogo ? (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] transition-shadow group-hover:shadow-[var(--shadow-glow-intense)]">
              <span className="text-black font-bold text-base">Z</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[var(--text-primary)]">
              ZUMATOMIC
            </span>
          </Link>
        ) : (
          <h1 className="font-semibold text-[17px] tracking-tight text-[var(--text-primary)]">{title}</h1>
        )}

        {showActions && (
          <div className="flex items-center gap-1">
            <button
              className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-[var(--bg-card)] active:bg-[var(--bg-elevated)] transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            </button>
            <Link
              href="/settings"
              className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-[var(--bg-card)] active:bg-[var(--bg-elevated)] transition-all duration-150"
              aria-label="Settings"
            >
              <Settings size={20} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
