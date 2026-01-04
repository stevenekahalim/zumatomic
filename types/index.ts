import { TierName, BadgeName, Location } from "@/lib/constants"

export interface User {
  id: string
  phone: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  phone: string
  avatarUrl?: string | null
}

export interface Team {
  id: string
  name: string
  captain: TeamMember
  partner: TeamMember
  mmr: number
  tier: TierName
  rank: number
  isOpenSparring: boolean
  winStreak: number
  badges: BadgeName[]
  createdAt: string
}

export interface Match {
  id: string
  seasonId: string
  teamA: Team
  teamB: Team
  scoreA: number
  scoreB: number
  winnerId: string
  submittedById: string
  verified: boolean
  verifiedAt?: string
  photoUrl?: string
  playedAt: string
  createdAt: string
}

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface LFOPost {
  id: string
  team: Team
  message?: string
  preferredDate: string
  preferredTime: string
  location: Location
  isActive: boolean
  createdAt: string
}

export interface LeaderboardEntry extends Team {
  rank: number
  matchesPlayed: number
  wins: number
  losses: number
  winRate: number
}

// API Response types (for future backend integration)
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
