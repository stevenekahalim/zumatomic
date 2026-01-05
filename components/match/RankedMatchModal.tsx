"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Calendar, Clock, Check, Zap, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { RippleButton } from "@/components/ui/RippleButton"

// Mock players for selection
const mockPlayers = [
  { id: "u001", name: "Andi Wijaya", mmr: 4.25 },
  { id: "u002", name: "Budi Santoso", mmr: 4.10 },
  { id: "u003", name: "Citra Dewi", mmr: 3.95 },
  { id: "u004", name: "Deni Pratama", mmr: 3.80 },
  { id: "u005", name: "Eka Fitriani", mmr: 3.65 },
  { id: "u006", name: "Fajar Gunawan", mmr: 3.50 },
  { id: "u007", name: "Gilang Hermawan", mmr: 4.05 },
  { id: "u008", name: "Hendra Irawan", mmr: 3.90 },
]

interface RankedMatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RankedMatchModal({ isOpen, onClose }: RankedMatchModalProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<(typeof mockPlayers[0] | null)[]>([
    mockPlayers[0], // Default current user
    null,
    null,
    null,
  ])
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const [sets, setSets] = useState<Array<{ teamA: string; teamB: string }>>([
    { teamA: "", teamB: "" }, // Set 1
    { teamA: "", teamB: "" }, // Set 2
    { teamA: "", teamB: "" }, // Set 3 (optional)
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Best-of-3 helper functions
  const updateSet = (setIndex: number, team: "teamA" | "teamB", value: string) => {
    const newSets = [...sets]
    newSets[setIndex][team] = value
    setSets(newSets)
  }

  const getSetWinner = (setIndex: number): "A" | "B" | null => {
    const a = parseInt(sets[setIndex].teamA) || 0
    const b = parseInt(sets[setIndex].teamB) || 0
    if (a === 0 && b === 0) return null
    if (a === b) return null
    return a > b ? "A" : "B"
  }

  const needsThirdSet = (): boolean => {
    const set1Winner = getSetWinner(0)
    const set2Winner = getSetWinner(1)
    return set1Winner !== null && set2Winner !== null && set1Winner !== set2Winner
  }

  const getMatchResult = (): { winner: "A" | "B"; score: string } | null => {
    let teamASets = 0
    let teamBSets = 0

    sets.forEach((_, i) => {
      const winner = getSetWinner(i)
      if (winner === "A") teamASets++
      if (winner === "B") teamBSets++
    })

    if (teamASets >= 2) return { winner: "A", score: `${teamASets}-${teamBSets}` }
    if (teamBSets >= 2) return { winner: "B", score: `${teamBSets}-${teamASets}` }
    return null
  }

  const handleSelectPlayer = (player: typeof mockPlayers[0]) => {
    if (activeSlot === null) return
    const newPlayers = [...selectedPlayers]
    newPlayers[activeSlot] = player
    setSelectedPlayers(newPlayers)
    setActiveSlot(null)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
      // Reset form
      setSelectedPlayers([mockPlayers[0], null, null, null])
      setSets([
        { teamA: "", teamB: "" },
        { teamA: "", teamB: "" },
        { teamA: "", teamB: "" },
      ])
    }, 2000)
  }

  const matchResult = getMatchResult()
  const isFormValid =
    selectedPlayers.every((p) => p !== null) && matchResult !== null

  const availablePlayers = mockPlayers.filter(
    (p) => !selectedPlayers.some((sp) => sp?.id === p.id)
  )

  // Team A = Players 0, 1 | Team B = Players 2, 3
  const teamAMmr = ((selectedPlayers[0]?.mmr || 0) + (selectedPlayers[1]?.mmr || 0)) / 2
  const teamBMmr = ((selectedPlayers[2]?.mmr || 0) + (selectedPlayers[3]?.mmr || 0)) / 2

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[var(--bg-void)] border-t border-white/10"
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2 bg-[var(--bg-void)]">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-toxic)]/20 flex items-center justify-center"
                >
                  <Check size={40} className="text-[var(--color-toxic)]" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Ranked Match Recorded!</h2>
                <p className="text-[var(--text-secondary)]">
                  Individual MMR will be updated
                </p>
              </motion.div>
            ) : (
              <div className="p-6 pb-safe">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Zap size={24} className="text-[var(--color-toxic)]" />
                      Input Skor Ranked
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      4 Players - Update MMR only
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Player Selection Grid */}
                <div className="mb-6">
                  <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-3">
                    Pemain (4 Orang)
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Team A */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-toxic)] flex items-center justify-center text-xs font-bold text-black">
                          A
                        </div>
                        <span className="text-sm font-medium">Tim A</span>
                        {selectedPlayers[0] && selectedPlayers[1] && (
                          <span className="text-xs text-[var(--text-secondary)] ml-auto">
                            Avg: {teamAMmr.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {[0, 1].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlot(idx)}
                          className={cn(
                            "w-full p-3 rounded-xl text-left transition-all",
                            activeSlot === idx
                              ? "ring-2 ring-[var(--color-toxic)] bg-[var(--color-toxic)]/10"
                              : "glass-card"
                          )}
                        >
                          {selectedPlayers[idx] ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[var(--color-toxic)]/20 flex items-center justify-center text-sm font-bold text-[var(--color-toxic)]">
                                {selectedPlayers[idx]!.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{selectedPlayers[idx]!.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  MMR: {selectedPlayers[idx]!.mmr.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <User size={20} className="text-[var(--text-tertiary)]" />
                              </div>
                              <span className="text-sm text-[var(--text-secondary)]">
                                Pilih Pemain {idx + 1}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Team B */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--tier-mythic)] flex items-center justify-center text-xs font-bold text-white">
                          B
                        </div>
                        <span className="text-sm font-medium">Tim B</span>
                        {selectedPlayers[2] && selectedPlayers[3] && (
                          <span className="text-xs text-[var(--text-secondary)] ml-auto">
                            Avg: {teamBMmr.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {[2, 3].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlot(idx)}
                          className={cn(
                            "w-full p-3 rounded-xl text-left transition-all",
                            activeSlot === idx
                              ? "ring-2 ring-[var(--tier-mythic)] bg-[var(--tier-mythic)]/10"
                              : "glass-card"
                          )}
                        >
                          {selectedPlayers[idx] ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[var(--tier-mythic)]/20 flex items-center justify-center text-sm font-bold text-[var(--tier-mythic)]">
                                {selectedPlayers[idx]!.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{selectedPlayers[idx]!.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  MMR: {selectedPlayers[idx]!.mmr.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <User size={20} className="text-[var(--text-tertiary)]" />
                              </div>
                              <span className="text-sm text-[var(--text-secondary)]">
                                Pilih Pemain {idx - 1}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Player Picker (when slot is active) */}
                <AnimatePresence>
                  {activeSlot !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-2">
                        Pilih Pemain
                      </p>
                      <div className="glass-card rounded-xl p-2 max-h-48 overflow-y-auto">
                        {availablePlayers.map((player) => (
                          <button
                            key={player.id}
                            onClick={() => handleSelectPlayer(player)}
                            className="w-full p-3 rounded-lg hover:bg-white/5 text-left flex items-center gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                              {player.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{player.name}</p>
                            </div>
                            <span className="text-sm text-[var(--text-secondary)]">
                              {player.mmr.toFixed(2)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score Input - Best of 3 */}
                <div className="mb-6">
                  <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-3">
                    Skor (Best of 3)
                  </p>

                  {/* Header Row */}
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div></div>
                    <div className="text-center text-xs text-[var(--text-secondary)]">Set 1</div>
                    <div className="text-center text-xs text-[var(--text-secondary)]">Set 2</div>
                    <div className="text-center text-xs text-[var(--text-secondary)]">Set 3</div>
                  </div>

                  {/* Team A Row */}
                  <div className="grid grid-cols-4 gap-2 mb-2 items-center">
                    <span className="text-sm font-medium text-[var(--color-toxic)]">Tim A</span>
                    {[0, 1, 2].map((setIndex) => (
                      <input
                        key={`a-${setIndex}`}
                        type="number"
                        min="0"
                        max="7"
                        value={sets[setIndex].teamA}
                        onChange={(e) => updateSet(setIndex, "teamA", e.target.value)}
                        disabled={setIndex === 2 && !needsThirdSet()}
                        className={cn(
                          "h-12 rounded-xl glass-card text-center text-xl font-mono font-bold",
                          "text-[var(--color-toxic)] focus:ring-2 focus:ring-[var(--color-toxic)] border-0 focus:outline-none",
                          setIndex === 2 && !needsThirdSet() && "opacity-30 cursor-not-allowed"
                        )}
                        placeholder="0"
                      />
                    ))}
                  </div>

                  {/* Team B Row */}
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm font-medium text-[var(--tier-mythic)]">Tim B</span>
                    {[0, 1, 2].map((setIndex) => (
                      <input
                        key={`b-${setIndex}`}
                        type="number"
                        min="0"
                        max="7"
                        value={sets[setIndex].teamB}
                        onChange={(e) => updateSet(setIndex, "teamB", e.target.value)}
                        disabled={setIndex === 2 && !needsThirdSet()}
                        className={cn(
                          "h-12 rounded-xl glass-card text-center text-xl font-mono font-bold",
                          "text-[var(--tier-mythic)] focus:ring-2 focus:ring-[var(--tier-mythic)] border-0 focus:outline-none",
                          setIndex === 2 && !needsThirdSet() && "opacity-30 cursor-not-allowed"
                        )}
                        placeholder="0"
                      />
                    ))}
                  </div>

                  {/* Match Result */}
                  {matchResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-center"
                    >
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                        matchResult.winner === "A"
                          ? "bg-[var(--color-toxic)]/20 text-[var(--color-toxic)]"
                          : "bg-[var(--tier-mythic)]/20 text-[var(--tier-mythic)]"
                      )}>
                        <Trophy size={16} />
                        Tim {matchResult.winner} Menang ({matchResult.score})
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Info Badge */}
                <div className="glass-card rounded-xl p-3 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-blue-400" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Ranked match updates <span className="text-white font-medium">Individual MMR only</span>.
                    For league matches, use the Record button → League Match.
                  </p>
                </div>

                {/* Submit Button */}
                <RippleButton
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Submit Ranked Match
                </RippleButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
