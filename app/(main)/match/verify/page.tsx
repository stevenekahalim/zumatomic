"use client"

import { useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  Camera,
  AlertTriangle,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"
import { Dialog } from "@/components/ui/Modal"
import { BottomSheet } from "@/components/ui/BottomSheet"
import { pageVariants } from "@/lib/animations"
import { CountUp, MMRChange } from "@/components/animations/CountUp"

// Mock match data
const mockMatch = {
  id: "match-001",
  submittedBy: "Alpha Strike",
  submittedAt: "2 menit lalu",
  deadline: "23:47",
  homeTeam: {
    id: "team-001",
    name: "Alpha Strike",
    avatar: "🎾",
    mmr: 1850,
    tier: "legend",
    players: ["Steven", "Budi"],
  },
  awayTeam: {
    id: "team-002",
    name: "Beta Force",
    avatar: "🏆",
    mmr: 1720,
    tier: "legend",
    players: ["Andi", "Rudi"],
  },
  score: { home: 3, away: 1 },
  sets: [
    { home: 6, away: 4 },
    { home: 4, away: 6 },
    { home: 6, away: 2 },
    { home: 6, away: 3 },
  ],
  proof: "/api/placeholder/400/300", // Placeholder image
  notes: "Match seru! Set ke-3 paling kompetitif.",
  mmrChange: { winner: 28, loser: -28 },
}

const rejectReasons = [
  "Skor tidak sesuai",
  "Foto tidak valid",
  "Ini bukan tim kami",
  "Match tidak pernah terjadi",
  "Lainnya",
]

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSets, setShowSets] = useState(false)
  const [showRejectSheet, setShowRejectSheet] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [customReason, setCustomReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<"confirm" | "reject" | null>(null)
  const [showProofModal, setShowProofModal] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowConfirmDialog(null)
    router.push("/match?verified=true")
  }

  const handleReject = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowRejectSheet(false)
    setShowConfirmDialog(null)
    router.push("/match?rejected=true")
  }

  const tierColors: Record<string, string> = {
    mythic: "text-atomic-purple",
    legend: "text-atomic-yellow",
    epic: "text-atomic-green",
    herald: "text-slate-400",
  }

  const isWinner = mockMatch.score.home > mockMatch.score.away

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen bg-dark-bg pb-safe"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
        <div className="flex items-center gap-4 p-4">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            aria-label="Kembali"
            onClick={() => router.back()}
            variant="ghost"
          />
          <div className="flex-1">
            <h1 className="text-lg font-bold">Verifikasi Hasil</h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Submitted by {mockMatch.submittedBy}
            </p>
          </div>
          <div className="flex items-center gap-1 text-atomic-yellow text-sm">
            <Clock className="w-4 h-4" />
            <span>{mockMatch.deadline}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Match Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
        >
          {/* Teams and Score */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-3xl">
                  {mockMatch.homeTeam.avatar}
                </div>
                <h3 className="font-bold text-sm mb-1">{mockMatch.homeTeam.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {mockMatch.homeTeam.players.join(" & ")}
                </p>
                <p className={`text-xs font-medium mt-1 ${tierColors[mockMatch.homeTeam.tier]}`}>
                  {mockMatch.homeTeam.mmr} MMR
                </p>
              </div>

              {/* Score */}
              <div className="px-6">
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-4xl font-black ${isWinner ? "text-atomic-green" : "text-white"}`}
                  >
                    {mockMatch.score.home}
                  </motion.span>
                  <span className="text-2xl text-[var(--text-secondary)]">-</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-4xl font-black ${!isWinner ? "text-atomic-green" : "text-white"}`}
                  >
                    {mockMatch.score.away}
                  </motion.span>
                </div>
                {isWinner && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-1 mt-2 text-atomic-green text-xs"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>Winner</span>
                  </motion.div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-atomic-cyan to-blue-500 flex items-center justify-center text-3xl">
                  {mockMatch.awayTeam.avatar}
                </div>
                <h3 className="font-bold text-sm mb-1">{mockMatch.awayTeam.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {mockMatch.awayTeam.players.join(" & ")}
                </p>
                <p className={`text-xs font-medium mt-1 ${tierColors[mockMatch.awayTeam.tier]}`}>
                  {mockMatch.awayTeam.mmr} MMR
                </p>
              </div>
            </div>
          </div>

          {/* Set Scores (Collapsible) */}
          <button
            onClick={() => setShowSets(!showSets)}
            className="w-full flex items-center justify-between px-4 py-3 border-t border-dark-border hover:bg-dark-border/30 transition-colors"
          >
            <span className="text-sm text-[var(--text-secondary)]">Detail Set</span>
            {showSets ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </button>

          <AnimatePresence>
            {showSets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-dark-border"
              >
                <div className="p-4 space-y-2">
                  {mockMatch.sets.map((set, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-[var(--text-secondary)]">Set {index + 1}</span>
                      <div className="flex items-center gap-3">
                        <span className={set.home > set.away ? "text-atomic-green font-bold" : ""}>
                          {set.home}
                        </span>
                        <span className="text-[var(--text-secondary)]">-</span>
                        <span className={set.away > set.home ? "text-atomic-green font-bold" : ""}>
                          {set.away}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MMR Change Preview */}
          <div className="px-4 py-3 border-t border-dark-border bg-dark-border/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">MMR Perubahan:</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{mockMatch.homeTeam.name}</span>
                  <MMRChange change={isWinner ? mockMatch.mmrChange.winner : mockMatch.mmrChange.loser} />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Proof Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-border">
            <Camera className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-sm font-medium">Bukti Foto</span>
          </div>
          <button
            onClick={() => setShowProofModal(true)}
            className="w-full aspect-[4/3] bg-dark-border flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <div className="text-center text-[var(--text-secondary)]">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tap untuk memperbesar</p>
            </div>
          </button>
        </motion.div>

        {/* Notes */}
        {mockMatch.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-4"
          >
            <h3 className="text-sm font-medium mb-2">Catatan</h3>
            <p className="text-sm text-[var(--text-secondary)]">{mockMatch.notes}</p>
          </motion.div>
        )}

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 p-4 bg-atomic-yellow/10 border border-atomic-yellow/30 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-atomic-yellow flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-atomic-yellow mb-1">Penting!</p>
            <p className="text-[var(--text-secondary)]">
              Pastikan skor dan bukti foto sudah benar sebelum memverifikasi.
              Hasil yang sudah diverifikasi tidak dapat diubah.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-bg/80 backdrop-blur-lg border-t border-dark-border">
        <div className="flex gap-3">
          <RippleButton
            variant="danger"
            size="lg"
            fullWidth
            leftIcon={<X className="w-5 h-5" />}
            onClick={() => setShowRejectSheet(true)}
          >
            Tolak
          </RippleButton>
          <RippleButton
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Check className="w-5 h-5" />}
            onClick={() => setShowConfirmDialog("confirm")}
            className="!bg-atomic-green hover:!bg-atomic-green/80"
          >
            SAH
          </RippleButton>
        </div>
      </div>

      {/* Reject Bottom Sheet */}
      <BottomSheet
        isOpen={showRejectSheet}
        onClose={() => setShowRejectSheet(false)}
        title="Alasan Penolakan"
      >
        <div className="p-4 space-y-3">
          {rejectReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedReason === reason
                  ? "border-red-500 bg-red-500/10"
                  : "border-dark-border hover:bg-dark-border/50"
              }`}
            >
              <span className="font-medium">{reason}</span>
            </button>
          ))}

          {selectedReason === "Lainnya" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                className="w-full p-4 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
            </motion.div>
          )}

          <RippleButton
            variant="danger"
            size="lg"
            fullWidth
            disabled={!selectedReason || (selectedReason === "Lainnya" && !customReason.trim())}
            onClick={() => setShowConfirmDialog("reject")}
          >
            Kirim Penolakan
          </RippleButton>
        </div>
      </BottomSheet>

      {/* Confirm Dialogs */}
      <Dialog
        isOpen={showConfirmDialog === "confirm"}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={handleConfirm}
        title="Konfirmasi Hasil"
        message="Hasil pertandingan akan disahkan dan MMR akan diperbarui. Lanjutkan?"
        confirmText="Ya, Sahkan"
        isLoading={isLoading}
      />

      <Dialog
        isOpen={showConfirmDialog === "reject"}
        onClose={() => setShowConfirmDialog(null)}
        onConfirm={handleReject}
        title="Tolak Hasil"
        message="Hasil pertandingan akan ditolak dan tim lawan akan diberi notifikasi. Lanjutkan?"
        confirmText="Ya, Tolak"
        variant="danger"
        isLoading={isLoading}
      />
    </motion.div>
  )
}

export default function MatchVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-atomic-purple/30 border-t-atomic-purple rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
