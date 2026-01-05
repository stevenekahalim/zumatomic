"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trophy, Calendar, Check, ChevronDown, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { RippleButton } from "@/components/ui/RippleButton"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"

interface LeagueMatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LeagueMatchModal({ isOpen, onClose }: LeagueMatchModalProps) {
  const teams = teamsData as Team[]

  const [teamA, setTeamA] = useState<Team | null>(null)
  const [teamB, setTeamB] = useState<Team | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<"A" | "B" | null>(null)
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

  const handleSelectTeam = (team: Team, side: "A" | "B") => {
    if (side === "A") {
      setTeamA(team)
    } else {
      setTeamB(team)
    }
    setActiveDropdown(null)
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
      setTeamA(null)
      setTeamB(null)
      setSets([
        { teamA: "", teamB: "" },
        { teamA: "", teamB: "" },
        { teamA: "", teamB: "" },
      ])
    }, 2000)
  }

  const matchResult = getMatchResult()
  const isFormValid = teamA && teamB && matchResult !== null && teamA.id !== teamB.id

  const availableTeamsForA = teams.filter((t) => t.id !== teamB?.id)
  const availableTeamsForB = teams.filter((t) => t.id !== teamA?.id)

  // Calculate LP change preview
  const calculateLPChange = () => {
    if (!teamA || !teamB || !matchResult) return null
    const winner = matchResult.winner

    // Simple LP calculation (would be more complex in reality)
    const baseLP = 25
    const winnerTeam = winner === "A" ? teamA : teamB
    const loserTeam = winner === "A" ? teamB : teamA
    const lpDiff = Math.round((loserTeam.mmr - winnerTeam.mmr) / 10)

    return {
      winner,
      winnerGain: Math.max(10, baseLP + lpDiff),
      loserLoss: Math.max(10, baseLP - lpDiff),
    }
  }

  const lpPreview = calculateLPChange()

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
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--tier-legend)]/20 flex items-center justify-center"
                >
                  <Trophy size={40} className="text-[var(--tier-legend)]" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Match Liga Tercatat!</h2>
                <p className="text-[var(--text-secondary)]">
                  League Points & Individual MMR diupdate
                </p>
              </motion.div>
            ) : (
              <div className="p-6 pb-safe">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Trophy size={24} className="text-[var(--tier-legend)]" />
                      Report League Match
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Official match - Update LP + MMR
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Team Selection */}
                <div className="mb-6">
                  <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold mb-3">
                    Pilih Tim
                  </p>

                  <div className="space-y-4">
                    {/* Team A Selector */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-toxic)] flex items-center justify-center text-xs font-bold text-black">
                          A
                        </div>
                        <span className="text-sm font-medium">Tim A</span>
                      </div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === "A" ? null : "A")}
                        className={cn(
                          "w-full p-4 rounded-xl text-left transition-all flex items-center justify-between",
                          activeDropdown === "A"
                            ? "ring-2 ring-[var(--color-toxic)] bg-[var(--color-toxic)]/10"
                            : "glass-card"
                        )}
                      >
                        {teamA ? (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                              style={{
                                background: `linear-gradient(135deg, ${teamA.tier === 'MYTHIC' ? 'var(--tier-mythic)' : teamA.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                              }}
                            >
                              {teamA.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{teamA.name}</p>
                                <TierBadge tier={teamA.tier} size="sm" />
                                {teamA.winStreak >= 3 && (
                                  <Flame size={14} className="text-orange-500" />
                                )}
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {teamA.captain.name} & {teamA.partner.name} • {teamA.mmr} LP
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[var(--text-secondary)]">Pilih Tim A...</span>
                        )}
                        <ChevronDown
                          size={20}
                          className={cn(
                            "text-[var(--text-tertiary)] transition-transform",
                            activeDropdown === "A" && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Team A Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === "A" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="glass-card rounded-xl mt-2 p-2 max-h-48 overflow-y-auto">
                              {availableTeamsForA.map((team) => (
                                <button
                                  key={team.id}
                                  onClick={() => handleSelectTeam(team, "A")}
                                  className="w-full p-3 rounded-lg hover:bg-white/5 text-left flex items-center gap-3 transition-colors"
                                >
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                                    style={{
                                      background: `linear-gradient(135deg, ${team.tier === 'MYTHIC' ? 'var(--tier-mythic)' : team.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                                    }}
                                  >
                                    {team.name.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm">{team.name}</p>
                                      <TierBadge tier={team.tier} size="sm" />
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {team.mmr} LP • Rank #{team.rank}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="px-4 text-sm font-bold text-[var(--text-tertiary)]">VS</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Team B Selector */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--tier-mythic)] flex items-center justify-center text-xs font-bold text-white">
                          B
                        </div>
                        <span className="text-sm font-medium">Tim B</span>
                      </div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === "B" ? null : "B")}
                        className={cn(
                          "w-full p-4 rounded-xl text-left transition-all flex items-center justify-between",
                          activeDropdown === "B"
                            ? "ring-2 ring-[var(--tier-mythic)] bg-[var(--tier-mythic)]/10"
                            : "glass-card"
                        )}
                      >
                        {teamB ? (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                              style={{
                                background: `linear-gradient(135deg, ${teamB.tier === 'MYTHIC' ? 'var(--tier-mythic)' : teamB.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                              }}
                            >
                              {teamB.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{teamB.name}</p>
                                <TierBadge tier={teamB.tier} size="sm" />
                                {teamB.winStreak >= 3 && (
                                  <Flame size={14} className="text-orange-500" />
                                )}
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {teamB.captain.name} & {teamB.partner.name} • {teamB.mmr} LP
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[var(--text-secondary)]">Pilih Tim B...</span>
                        )}
                        <ChevronDown
                          size={20}
                          className={cn(
                            "text-[var(--text-tertiary)] transition-transform",
                            activeDropdown === "B" && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Team B Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === "B" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="glass-card rounded-xl mt-2 p-2 max-h-48 overflow-y-auto">
                              {availableTeamsForB.map((team) => (
                                <button
                                  key={team.id}
                                  onClick={() => handleSelectTeam(team, "B")}
                                  className="w-full p-3 rounded-lg hover:bg-white/5 text-left flex items-center gap-3 transition-colors"
                                >
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                                    style={{
                                      background: `linear-gradient(135deg, ${team.tier === 'MYTHIC' ? 'var(--tier-mythic)' : team.tier === 'LEGEND' ? 'var(--tier-legend)' : 'var(--tier-epic)'} 0%, var(--bg-void) 100%)`,
                                    }}
                                  >
                                    {team.name.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm">{team.name}</p>
                                      <TierBadge tier={team.tier} size="sm" />
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {team.mmr} LP • Rank #{team.rank}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

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
                    <span className="text-sm font-medium text-[var(--color-toxic)] truncate">
                      {teamA?.name || "Tim A"}
                    </span>
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
                    <span className="text-sm font-medium text-[var(--tier-mythic)] truncate">
                      {teamB?.name || "Tim B"}
                    </span>
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
                        {matchResult.winner === "A" ? teamA?.name : teamB?.name} Menang ({matchResult.score})
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* LP Change Preview */}
                {lpPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4 mb-6"
                  >
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-3">
                      Perkiraan Perubahan LP
                    </p>
                    <div className="flex justify-between">
                      <div className={cn(
                        "text-center flex-1",
                        lpPreview.winner === "A" ? "text-green-400" : "text-red-400"
                      )}>
                        <p className="text-lg font-bold">
                          {lpPreview.winner === "A" ? `+${lpPreview.winnerGain}` : `-${lpPreview.loserLoss}`}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{teamA?.name}</p>
                      </div>
                      <div className={cn(
                        "text-center flex-1",
                        lpPreview.winner === "B" ? "text-green-400" : "text-red-400"
                      )}>
                        <p className="text-lg font-bold">
                          {lpPreview.winner === "B" ? `+${lpPreview.winnerGain}` : `-${lpPreview.loserLoss}`}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{teamB?.name}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Info Badge */}
                <div className="glass-card rounded-xl p-3 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--tier-legend)]/20 flex items-center justify-center flex-shrink-0">
                    <Trophy size={20} className="text-[var(--tier-legend)]" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Match liga akan update <span className="text-[var(--tier-legend)] font-medium">League Points</span> dan{" "}
                    <span className="text-white font-medium">Individual MMR</span> semua pemain.
                  </p>
                </div>

                {/* Submit Button */}
                <RippleButton
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Menyimpan..."
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="bg-[var(--tier-legend)] text-white"
                >
                  Report League Match
                </RippleButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
