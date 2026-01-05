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

// Lobby System (Reclub-style)
export interface LobbyPlayer {
  id: string
  name: string
  avatar?: string
  mmr: number
  team?: "A" | "B"  // Team assignment within the lobby
}

export interface Lobby {
  id: string
  type: "RANKED" | "LEAGUE"
  customTitle: string

  // Host
  hostId: string
  hostName: string
  hostAvatar?: string
  hostPhone?: string     // For WhatsApp link
  teamId?: string        // For league lobbies
  teamName?: string

  // Schedule
  date: string           // "2026-01-05"
  time: string           // "20:00"
  duration: number       // Hours (1, 2, 3)

  // Location
  locationType: "VENUE" | "FLEXIBLE"
  locationName: string   // Venue name or area
  locationAddress?: string

  // Constraints
  minMmr?: number
  maxMmr?: number

  // Roster
  maxPlayers: number     // Usually 4
  confirmedPlayers: LobbyPlayer[]
  requestedPlayers: LobbyPlayer[]

  // Status
  status: "OPEN" | "FULL" | "FINISHED"

  // Meta
  notes: string
  createdAt: string
}

export interface LobbyMessage {
  id: string
  lobbyId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
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
