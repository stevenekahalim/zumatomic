"use client"

interface LobbyDateHeaderProps {
  date: string // "2026-01-05"
}

export function LobbyDateHeader({ date }: LobbyDateHeaderProps) {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).toUpperCase()
  }

  return (
    <div className="sticky top-[calc(var(--header-height)+140px)] z-10 py-2 -mx-4 px-4 bg-[var(--bg-void)]/95 backdrop-blur-sm">
      <p className="text-[11px] font-semibold text-[var(--text-tertiary)] tracking-wider">
        {formatDate(date)}
      </p>
    </div>
  )
}
