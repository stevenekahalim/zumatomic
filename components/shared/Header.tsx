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
        "sticky top-0 z-40 glass-elevated",
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
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-[0_0_16px_rgba(204,255,0,0.4)]">
              <span className="text-black font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-[var(--text-primary)]">
              ZUMATOMIC
            </span>
          </Link>
        ) : (
          <h1 className="font-bold text-[17px] tracking-tight text-[var(--text-primary)]">{title}</h1>
        )}

        {showActions && (
          <div className="flex items-center gap-1">
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--bg-input)] active:bg-[var(--border-light)] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-[var(--text-secondary)]" />
            </button>
            <Link
              href="/settings"
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--bg-input)] active:bg-[var(--border-light)] transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-[var(--text-secondary)]" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
