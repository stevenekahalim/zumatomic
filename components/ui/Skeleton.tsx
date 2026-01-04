"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "default" | "circular" | "rounded"
  width?: string | number
  height?: string | number
  animate?: boolean
  style?: React.CSSProperties
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animate = true,
  style,
}: SkeletonProps) {
  const variants = {
    default: "rounded-md",
    circular: "rounded-full",
    rounded: "rounded-xl",
  }

  return (
    <div
      className={cn(
        "bg-dark-border",
        animate && "shimmer",
        variants[variant],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

// Skeleton text lines
interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
}

export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = "60%",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-4"
          style={{
            width: index === lines - 1 ? lastLineWidth : "100%",
          }}
        />
      ))}
    </div>
  )
}

// Skeleton Avatar
interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const avatarSizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
}

export function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
  return (
    <Skeleton
      variant="circular"
      className={cn(avatarSizes[size], className)}
    />
  )
}

// Skeleton Card (for team cards, match cards, etc.)
interface SkeletonCardProps {
  className?: string
  showAvatar?: boolean
  showAction?: boolean
}

export function SkeletonCard({
  className,
  showAvatar = true,
  showAction = false,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "p-4 bg-dark-card border border-dark-border rounded-xl",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showAvatar && <SkeletonAvatar size="lg" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        {showAction && <Skeleton className="w-20 h-8 rounded-lg" />}
      </div>
    </div>
  )
}

// Skeleton List (multiple cards)
interface SkeletonListProps {
  count?: number
  className?: string
  cardProps?: SkeletonCardProps
}

export function SkeletonList({
  count = 5,
  className,
  cardProps,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} {...cardProps} />
      ))}
    </div>
  )
}

// Skeleton Stat Card
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-4 bg-dark-card border border-dark-border rounded-xl text-center",
        className
      )}
    >
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  )
}

// Skeleton Match Card
export function SkeletonMatchCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-4 bg-dark-card border border-dark-border rounded-xl",
        className
      )}
    >
      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-12" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <SkeletonAvatar size="md" />
        </div>
      </div>
      {/* Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-border">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

// Skeleton Leaderboard Row
export function SkeletonLeaderboardRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-xl",
        className
      )}
    >
      <Skeleton className="w-8 h-8" variant="circular" />
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  )
}

// Skeleton Profile Header
export function SkeletonProfileHeader({ className }: { className?: string }) {
  return (
    <div className={cn("text-center", className)}>
      <SkeletonAvatar size="xl" className="w-24 h-24 mx-auto mb-4" />
      <Skeleton className="h-6 w-40 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto mb-4" />
      <div className="flex justify-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}
