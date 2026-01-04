"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Camera, Check, Share2, X } from "lucide-react"
import { TierBadge } from "@/components/leaderboard/TierBadge"
import { cn } from "@/lib/utils"
import teamsData from "@/data/mock/teams.json"
import { Team } from "@/types"

type Step = "select-team" | "input-score" | "upload-photo" | "success"

export default function NewMatchPage() {
  const [step, setStep] = useState<Step>("select-team")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOpponent, setSelectedOpponent] = useState<Team | null>(null)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)

  const teams = teamsData as Team[]

  // Mock my team
  const myTeam = teams[0] // Duo Maut

  // Filter opponents (exclude my team)
  const availableOpponents = teams.filter((team) => {
    if (team.id === myTeam.id) return false
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      team.name.toLowerCase().includes(query) ||
      team.captain.name.toLowerCase().includes(query) ||
      team.partner.name.toLowerCase().includes(query)
    )
  })

  const isWin = scoreA > scoreB

  const handleSelectOpponent = (team: Team) => {
    setSelectedOpponent(team)
    setStep("input-score")
  }

  const handleScoreSubmit = () => {
    if (scoreA === scoreB) return // Can't have draw
    setStep("upload-photo")
  }

  const handlePhotoSubmit = () => {
    // In real app, would upload photo here
    setStep("success")
  }

  const renderSelectTeam = () => (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <h2 className="font-semibold mb-4">Pilih Lawan</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          type="text"
          placeholder="Cari tim lawan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-sm focus:outline-none focus:border-atomic-purple"
        />
      </div>

      {/* Team List */}
      <div className="space-y-3">
        {availableOpponents.slice(0, 10).map((team) => (
          <button
            key={team.id}
            onClick={() => handleSelectOpponent(team)}
            className="w-full text-left bg-dark-card border border-dark-border rounded-xl p-4 hover:border-atomic-purple transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-dark-border flex items-center justify-center font-bold">
                {team.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{team.name}</span>
                  <TierBadge tier={team.tier} size="sm" showLabel={false} />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {team.captain.name} & {team.partner.name}
                </p>
              </div>
              <div className="text-right text-sm">
                <span className="text-[var(--text-secondary)]">#{team.rank}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderInputScore = () => (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <button
        onClick={() => setStep("select-team")}
        className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Ganti Lawan
      </button>

      {/* VS Display */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* My Team */}
          <div className="text-center flex-1">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-xl font-bold mx-auto mb-2">
              {myTeam.name.charAt(0)}
            </div>
            <p className="font-semibold text-sm">{myTeam.name}</p>
            <TierBadge tier={myTeam.tier} size="sm" className="mt-1" />
          </div>

          {/* VS */}
          <div className="px-4">
            <span className="text-2xl font-bold text-[var(--text-secondary)]">
              VS
            </span>
          </div>

          {/* Opponent */}
          <div className="text-center flex-1">
            <div className="w-16 h-16 rounded-xl bg-dark-border flex items-center justify-center text-xl font-bold mx-auto mb-2">
              {selectedOpponent?.name.charAt(0)}
            </div>
            <p className="font-semibold text-sm">{selectedOpponent?.name}</p>
            {selectedOpponent && (
              <TierBadge tier={selectedOpponent.tier} size="sm" className="mt-1" />
            )}
          </div>
        </div>
      </div>

      {/* Score Input */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <h3 className="text-center font-semibold mb-6">Input Skor</h3>

        <div className="flex items-center justify-center gap-8">
          {/* Score A */}
          <div className="text-center">
            <button
              onClick={() => setScoreA(Math.min(7, scoreA + 1))}
              className="w-16 h-12 bg-dark-border rounded-lg text-2xl font-bold hover:bg-atomic-purple/30 transition-colors"
            >
              +
            </button>
            <div className="text-5xl font-bold my-4">{scoreA}</div>
            <button
              onClick={() => setScoreA(Math.max(0, scoreA - 1))}
              className="w-16 h-12 bg-dark-border rounded-lg text-2xl font-bold hover:bg-atomic-purple/30 transition-colors"
            >
              -
            </button>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {myTeam.name}
            </p>
          </div>

          <span className="text-3xl font-bold text-[var(--text-secondary)]">
            :
          </span>

          {/* Score B */}
          <div className="text-center">
            <button
              onClick={() => setScoreB(Math.min(7, scoreB + 1))}
              className="w-16 h-12 bg-dark-border rounded-lg text-2xl font-bold hover:bg-atomic-purple/30 transition-colors"
            >
              +
            </button>
            <div className="text-5xl font-bold my-4">{scoreB}</div>
            <button
              onClick={() => setScoreB(Math.max(0, scoreB - 1))}
              className="w-16 h-12 bg-dark-border rounded-lg text-2xl font-bold hover:bg-atomic-purple/30 transition-colors"
            >
              -
            </button>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {selectedOpponent?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleScoreSubmit}
        disabled={scoreA === scoreB}
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-colors",
          scoreA === scoreB
            ? "bg-dark-border text-[var(--text-secondary)] cursor-not-allowed"
            : "bg-gradient-to-r from-atomic-purple to-atomic-pink text-white"
        )}
      >
        Lanjutkan
      </button>
      {scoreA === scoreB && (
        <p className="text-center text-sm text-[var(--text-secondary)] mt-2">
          Skor tidak boleh seri
        </p>
      )}
    </div>
  )

  const renderUploadPhoto = () => (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <button
        onClick={() => setStep("input-score")}
        className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <h2 className="font-semibold mb-4">Upload Bukti Pertandingan</h2>

      {/* Score Summary */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">{myTeam.name}</p>
            <p
              className={cn(
                "text-3xl font-bold",
                isWin ? "text-atomic-green" : "text-red-500"
              )}
            >
              {scoreA}
            </p>
          </div>
          <span className="text-xl text-[var(--text-secondary)]">:</span>
          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {selectedOpponent?.name}
            </p>
            <p
              className={cn(
                "text-3xl font-bold",
                !isWin ? "text-atomic-green" : "text-red-500"
              )}
            >
              {scoreB}
            </p>
          </div>
        </div>
        <p
          className={cn(
            "text-center mt-2 font-semibold",
            isWin ? "text-atomic-green" : "text-red-500"
          )}
        >
          {isWin ? "MENANG!" : "KALAH"}
        </p>
      </div>

      {/* Photo Upload Area */}
      <div className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center mb-6">
        <Camera size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
        <p className="text-[var(--text-secondary)] mb-4">
          Upload foto papan skor atau screenshot
        </p>
        <button className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm font-medium hover:border-atomic-purple transition-colors">
          Pilih Foto
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handlePhotoSubmit}
        className="w-full py-3 bg-gradient-to-r from-atomic-purple to-atomic-pink text-white rounded-xl font-semibold"
      >
        Submit Hasil
      </button>
      <button
        onClick={handlePhotoSubmit}
        className="w-full py-3 text-[var(--text-secondary)] text-sm mt-2"
      >
        Lewati (tanpa foto)
      </button>
    </div>
  )

  const renderSuccess = () => (
    <div className="px-4 py-8 max-w-lg mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-atomic-green/20 flex items-center justify-center mx-auto mb-6">
        <Check size={40} className="text-atomic-green" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Hasil Terkirim!</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Menunggu verifikasi dari {selectedOpponent?.name}
      </p>

      {/* Result Card */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center font-bold mb-2",
                isWin
                  ? "bg-gradient-to-br from-atomic-green to-emerald-600"
                  : "bg-dark-border"
              )}
            >
              {myTeam.name.charAt(0)}
            </div>
            <p className="text-sm font-medium">{myTeam.name}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold">
              {scoreA} : {scoreB}
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                isWin ? "text-atomic-green" : "text-red-500"
              )}
            >
              {isWin ? "WIN" : "LOSE"}
            </p>
          </div>

          <div className="text-center">
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center font-bold mb-2",
                !isWin
                  ? "bg-gradient-to-br from-atomic-green to-emerald-600"
                  : "bg-dark-border"
              )}
            >
              {selectedOpponent?.name.charAt(0)}
            </div>
            <p className="text-sm font-medium">{selectedOpponent?.name}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-dark-card border border-dark-border rounded-xl font-semibold flex items-center justify-center gap-2">
          <Share2 size={18} />
          Share Story
        </button>
        <Link
          href="/"
          className="flex-1 py-3 bg-gradient-to-r from-atomic-purple to-atomic-pink text-white rounded-xl font-semibold text-center"
        >
          Selesai
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-[var(--header-height)] z-30 glass border-b border-dark-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Link href="/">
            <X size={24} className="text-[var(--text-secondary)]" />
          </Link>
          <h1 className="font-bold text-lg">Input Skor</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1 px-4 pb-3 max-w-lg mx-auto">
          {["select-team", "input-score", "upload-photo", "success"].map(
            (s, i) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1 rounded-full",
                  ["select-team", "input-score", "upload-photo", "success"].indexOf(
                    step
                  ) >= i
                    ? "bg-atomic-purple"
                    : "bg-dark-border"
                )}
              />
            )
          )}
        </div>
      </div>

      {/* Content */}
      {step === "select-team" && renderSelectTeam()}
      {step === "input-score" && renderInputScore()}
      {step === "upload-photo" && renderUploadPhoto()}
      {step === "success" && renderSuccess()}
    </div>
  )
}
