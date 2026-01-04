import { TIERS, TierName } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface TierBadgeProps {
  tier: TierName
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  className
}: TierBadgeProps) {
  const tierConfig = TIERS[tier]

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full",
        tierConfig.bgClass,
        tierConfig.glowClass,
        sizeClasses[size],
        tier === "LEGEND" && "text-black",
        className
      )}
    >
      {showLabel ? tierConfig.name : tier.charAt(0)}
    </span>
  )
}
