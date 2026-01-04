// ========================================
// ZUMATOMIC DESIGN SYSTEM - CONSTANTS
// Code Name: Nocturnal Stadium
// ========================================

// Brand Colors (matching CSS custom properties)
export const COLORS = {
  // Core Brand
  toxic: "#CCFF00",           // Primary Action - Electric Lime
  forest: "#064E3B",          // Brand Identity - Deep Racing Green
  error: "#FF3B30",           // Destructive - Neon Red

  // Backgrounds
  void: "#050505",            // Main App Background
  depth: "#001A0E",           // Deep Forest Green for gradients

  // Tiers
  tierMythic: "#D946EF",      // Fuchsia Neon
  tierLegend: "#EAB308",      // Gold
  tierEpic: "#22C55E",        // Bright Green
  tierHerald: "#94A3B8",      // Cool Grey

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",   // Zinc 400
  textTertiary: "#52525B",    // Zinc 600

  // Glass Material
  glassBg: "rgba(20, 20, 20, 0.65)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassBorderTop: "rgba(255, 255, 255, 0.15)",
} as const

// Tier Configuration - Nocturnal Stadium Theme
export const TIERS = {
  MYTHIC: {
    name: "Mythic",
    minRank: 1,
    maxRank: 10,
    color: "#D946EF",
    bgClass: "bg-[var(--tier-mythic)]",
    textClass: "text-[var(--tier-mythic)]",
    glowClass: "shadow-[0_0_20px_rgba(217,70,239,0.4)]",
    description: "The Gods. Penguasa Surabaya.",
  },
  LEGEND: {
    name: "Legend",
    minRank: 11,
    maxRank: 30,
    color: "#EAB308",
    bgClass: "bg-[var(--tier-legend)]",
    textClass: "text-[var(--tier-legend)]",
    glowClass: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    description: "The Elites. Papan atas.",
  },
  EPIC: {
    name: "Epic",
    minRank: 31,
    maxRank: 60,
    color: "#22C55E",
    bgClass: "bg-[var(--tier-epic)]",
    textClass: "text-[var(--tier-epic)]",
    glowClass: "",
    description: "The Grinders. Zona persaingan.",
  },
  HERALD: {
    name: "Herald",
    minRank: 61,
    maxRank: Infinity,
    color: "#94A3B8",
    bgClass: "bg-[var(--tier-herald)]",
    textClass: "text-[var(--tier-herald)]",
    glowClass: "",
    description: "The Starters. Pemula/Casual.",
  },
} as const

export type TierName = keyof typeof TIERS

// Get tier from rank
export function getTierFromRank(rank: number): TierName {
  if (rank <= 10) return "MYTHIC"
  if (rank <= 30) return "LEGEND"
  if (rank <= 60) return "EPIC"
  return "HERALD"
}

// Badge Types
export const BADGES = {
  ON_FIRE: {
    name: "On Fire",
    icon: "flame",
    emoji: "🔥",
    description: "Menang 3x berturut-turut",
  },
  DONUT_KING: {
    name: "Donut King",
    icon: "donut",
    emoji: "🍩",
    description: "Kalah telak 0-6 (Bagel)",
  },
  GIANT_SLAYER: {
    name: "Giant Slayer",
    icon: "shield",
    emoji: "🛡️",
    description: "Mengalahkan Tim Top 10",
  },
  NIGHT_OWL: {
    name: "Night Owl",
    icon: "moon",
    emoji: "🌙",
    description: "Sering main malam (>22:00)",
  },
  MARATHON: {
    name: "The Marathon",
    icon: "running",
    emoji: "🏃",
    description: "Main >5 match dalam seminggu",
  },
} as const

export type BadgeName = keyof typeof BADGES

// Locations
export const LOCATIONS = ["WEST", "EAST", "CENTER"] as const
export type Location = (typeof LOCATIONS)[number]

// MMR Configuration
export const MMR_CONFIG = {
  startingPoints: 1000,
  minPoints: 0,
  normalWin: 25,
  normalLose: -25,
  giantKillingWin: 40,
  giantKillingLose: -40,
  stompingWin: 10,
  stompingLose: -5,
  tierDifferenceThreshold: 100,
} as const
