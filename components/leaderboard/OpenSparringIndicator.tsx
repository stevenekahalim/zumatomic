import { cn } from "@/lib/utils"

interface OpenSparringIndicatorProps {
  isOpen: boolean
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function OpenSparringIndicator({
  isOpen,
  size = "md",
  showLabel = false,
  className
}: OpenSparringIndicatorProps) {
  if (!isOpen) return null

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "rounded-full status-open",
          dotSizes[size]
        )}
      />
      {showLabel && (
        <span className="text-xs text-[var(--color-toxic)] font-medium">
          Open Sparring
        </span>
      )}
    </div>
  )
}
