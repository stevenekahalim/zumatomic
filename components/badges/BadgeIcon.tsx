import { BADGES, BadgeName } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface BadgeIconProps {
  badge: BadgeName
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  className?: string
}

export function BadgeIcon({
  badge,
  size = "md",
  showTooltip = false,
  className
}: BadgeIconProps) {
  const badgeConfig = BADGES[badge]

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  return (
    <span
      className={cn(sizeClasses[size], className)}
      title={showTooltip ? `${badgeConfig.name}: ${badgeConfig.description}` : undefined}
    >
      {badgeConfig.emoji}
    </span>
  )
}

interface BadgeListProps {
  badges: BadgeName[]
  size?: "sm" | "md" | "lg"
  maxDisplay?: number
  className?: string
}

export function BadgeList({
  badges,
  size = "md",
  maxDisplay = 3,
  className
}: BadgeListProps) {
  if (badges.length === 0) return null

  const displayBadges = badges.slice(0, maxDisplay)
  const remaining = badges.length - maxDisplay

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {displayBadges.map((badge) => (
        <BadgeIcon key={badge} badge={badge} size={size} showTooltip />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-[var(--text-secondary)] ml-1">
          +{remaining}
        </span>
      )}
    </div>
  )
}
