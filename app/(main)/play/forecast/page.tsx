"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Target, Users, Zap, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"

// Mock players data
const mockPlayers = [
  { id: "1", name: "Andi Wijaya", mmr: 4.25 },
  { id: "2", name: "Budi Santoso", mmr: 4.10 },
  { id: "3", name: "Citra Dewi", mmr: 3.95 },
  { id: "4", name: "Deni Pratama", mmr: 3.80 },
]

export default function ForecastPage() {
  const router = useRouter()
  const [teamA, setTeamA] = useState<{ player1: typeof mockPlayers[0] | null; player2: typeof mockPlayers[0] | null }>({
    player1: mockPlayers[0],
    player2: mockPlayers[1],
  })
  const [teamB, setTeamB] = useState<{ player1: typeof mockPlayers[0] | null; player2: typeof mockPlayers[0] | null }>({
    player1: mockPlayers[2],
    player2: mockPlayers[3],
  })
  const [showResult, setShowResult] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate win probability based on average MMR
  const calculateProbability = () => {
    const avgA = ((teamA.player1?.mmr || 0) + (teamA.player2?.mmr || 0)) / 2
    const avgB = ((teamB.player1?.mmr || 0) + (teamB.player2?.mmr || 0)) / 2
    const diff = avgA - avgB
    // Simple Elo-based probability
    const probA = 1 / (1 + Math.pow(10, -diff / 0.4))
    return Math.round(probA * 100)
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsCalculating(false)
    setShowResult(true)
  }

  const winProbA = calculateProbability()
  const winProbB = 100 - winProbA

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div
        className="sticky top-0 z-30 glass-elevated"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div
          className="flex items-center gap-3 h-14"
          style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
        >
          <IconButton
            icon={<ArrowLeft size={20} />}
            aria-label="Kembali"
            onClick={() => router.back()}
            variant="ghost"
          />
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Target size={20} className="text-[var(--tier-mythic)]" />
            Match Forecast
          </h1>
        </div>
      </div>

      <div
        className="max-w-[var(--content-max-width)] mx-auto py-6"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        {/* Team A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-toxic)] flex items-center justify-center text-sm font-bold text-black">
              A
            </div>
            <span className="font-semibold">Tim Kamu</span>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {[teamA.player1, teamA.player2].map((player, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-medium">
                  {player?.name.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{player?.name || "Pilih pemain"}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    MMR: {player?.mmr.toFixed(2) || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VS Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 h-px bg-white/10" />
          <div className="px-4 py-2 glass-card rounded-full text-sm font-bold text-[var(--text-secondary)]">
            VS
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Team B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--tier-mythic)] flex items-center justify-center text-sm font-bold text-white">
              B
            </div>
            <span className="font-semibold">Lawan</span>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {[teamB.player1, teamB.player2].map((player, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-medium">
                  {player?.name.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{player?.name || "Pilih pemain"}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    MMR: {player?.mmr.toFixed(2) || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        {showResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 mb-6"
          >
            <h3 className="text-center text-sm text-[var(--text-secondary)] mb-4">
              Prediksi Hasil
            </h3>

            {/* Probability Bar */}
            <div className="relative h-12 rounded-full overflow-hidden bg-[var(--tier-mythic)]/30 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winProbA}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-0 top-0 bottom-0 bg-[var(--color-toxic)] rounded-l-full flex items-center justify-start pl-4"
              >
                <span className="font-bold text-black">{winProbA}%</span>
              </motion.div>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4">
                <span className="font-bold text-white">{winProbB}%</span>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-toxic)] font-medium">Tim Kamu</span>
              <span className="text-[var(--tier-mythic)] font-medium">Lawan</span>
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 rounded-xl bg-white/5 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                {winProbA > 60 ? (
                  <>Kamu punya <span className="text-[var(--color-toxic)] font-medium">keunggulan</span> di match ini!</>
                ) : winProbA < 40 ? (
                  <>Match ini akan jadi <span className="text-[var(--tier-mythic)] font-medium">tantangan</span> untuk kamu</>
                ) : (
                  <>Ini akan jadi <span className="text-[var(--tier-legend)] font-medium">pertarungan seru</span>!</>
                )}
              </p>
            </div>

            {/* Share Button */}
            <RippleButton
              fullWidth
              variant="outline"
              className="mt-4"
              leftIcon={<Share2 size={18} />}
            >
              Bagikan Prediksi
            </RippleButton>
          </motion.div>
        ) : (
          <RippleButton
            fullWidth
            size="lg"
            isLoading={isCalculating}
            loadingText="Menghitung..."
            onClick={handleCalculate}
            leftIcon={<Zap size={20} />}
          >
            Hitung Prediksi
          </RippleButton>
        )}
      </div>
    </div>
  )
}
