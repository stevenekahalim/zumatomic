"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Search,
  Phone,
  Check,
  Sparkles,
} from "lucide-react"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"
import { StepProgress } from "@/components/ui/ProgressBar"
import { pageVariants } from "@/lib/animations"
import { CelebrationModal } from "@/components/animations/Confetti"

const steps = ["Nama Tim", "Cari Partner", "Avatar", "Konfirmasi"]

const avatarOptions = [
  { id: 1, emoji: "🎾", bg: "from-atomic-purple to-atomic-pink" },
  { id: 2, emoji: "🏆", bg: "from-atomic-yellow to-orange-500" },
  { id: 3, emoji: "⚡", bg: "from-atomic-cyan to-blue-500" },
  { id: 4, emoji: "🔥", bg: "from-red-500 to-orange-500" },
  { id: 5, emoji: "💜", bg: "from-purple-500 to-pink-500" },
  { id: 6, emoji: "🌟", bg: "from-yellow-400 to-atomic-yellow" },
  { id: 7, emoji: "🎯", bg: "from-green-500 to-emerald-500" },
  { id: 8, emoji: "💪", bg: "from-indigo-500 to-purple-500" },
]

// Mock users for partner search
const mockUsers = [
  { id: "u1", name: "Budi Santoso", phone: "+62 812 3456 7890" },
  { id: "u2", name: "Andi Wijaya", phone: "+62 813 2345 6789" },
  { id: "u3", name: "Rudi Hermawan", phone: "+62 814 3456 7890" },
  { id: "u4", name: "Doni Pratama", phone: "+62 815 4567 8901" },
]

export default function CreateTeamPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [teamName, setTeamName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPartner, setSelectedPartner] = useState<typeof mockUsers[0] | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return teamName.trim().length >= 3
      case 1:
        return selectedPartner !== null || phoneNumber.length >= 10
      case 2:
        return selectedAvatar !== null
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    } else {
      router.back()
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setShowSuccess(true)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold mb-2">Nama Tim</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Pilih nama yang keren untuk tim kamu!
              </p>
            </div>

            <div>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Masukkan nama tim"
                maxLength={20}
                className="w-full px-4 py-4 bg-dark-card border border-dark-border rounded-xl text-white text-center text-lg font-semibold placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-atomic-purple"
              />
              <p className="text-center text-xs text-[var(--text-secondary)] mt-2">
                {teamName.length}/20 karakter
              </p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <h3 className="text-sm font-medium mb-3">Tips nama tim:</h3>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                <li>• Minimal 3 karakter</li>
                <li>• Gunakan nama yang unik dan mudah diingat</li>
                <li>• Hindari kata-kata kasar atau menyinggung</li>
              </ul>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">Cari Partner</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Undang teman kamu untuk bergabung
              </p>
            </div>

            {/* Search existing users */}
            <div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama"
                  className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-atomic-purple"
                />
              </div>

              {searchQuery && (
                <div className="mt-3 space-y-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setSelectedPartner(user)
                          setPhoneNumber("")
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          selectedPartner?.id === user.id
                            ? "border-atomic-purple bg-atomic-purple/10"
                            : "border-dark-border hover:bg-dark-border/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-lg">
                          {user.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {user.phone}
                          </p>
                        </div>
                        {selectedPartner?.id === user.id && (
                          <div className="w-6 h-6 rounded-full bg-atomic-purple flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-sm text-[var(--text-secondary)] py-4">
                      Tidak ditemukan
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-bg text-[var(--text-secondary)]">
                  atau undang via nomor telepon
                </span>
              </div>
            </div>

            {/* Phone number input */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  setSelectedPartner(null)
                }}
                placeholder="+62 812 3456 7890"
                className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-atomic-purple"
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">Pilih Avatar Tim</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Avatar ini akan mewakili tim kamu
              </p>
            </div>

            {/* Selected preview */}
            <motion.div layout className="relative w-24 h-24 mx-auto mb-8">
              {selectedAvatar ? (
                <motion.div
                  key={selectedAvatar}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`w-full h-full rounded-3xl bg-gradient-to-br ${
                    avatarOptions.find((a) => a.id === selectedAvatar)?.bg
                  } flex items-center justify-center text-5xl shadow-lg`}
                >
                  {avatarOptions.find((a) => a.id === selectedAvatar)?.emoji}
                </motion.div>
              ) : (
                <div className="w-full h-full rounded-3xl bg-dark-card border-2 border-dashed border-dark-border flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[var(--text-secondary)]" />
                </div>
              )}
            </motion.div>

            {/* Avatar grid */}
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar, index) => (
                <motion.button
                  key={avatar.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${avatar.bg} flex items-center justify-center text-3xl transition-all ${
                    selectedAvatar === avatar.id
                      ? "ring-2 ring-white ring-offset-2 ring-offset-dark-bg"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {avatar.emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">Konfirmasi Tim</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Pastikan semua informasi sudah benar
              </p>
            </div>

            {/* Team preview card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br ${
                  avatarOptions.find((a) => a.id === selectedAvatar)?.bg
                } flex items-center justify-center text-4xl shadow-lg`}
              >
                {avatarOptions.find((a) => a.id === selectedAvatar)?.emoji}
              </motion.div>

              <h3 className="text-xl font-bold mb-1">{teamName}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Tier: Herald • 1000 MMR
              </p>

              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="px-3 py-1 bg-atomic-purple/20 text-atomic-purple rounded-full">
                  Kamu
                </div>
                <span className="text-[var(--text-secondary)]">&</span>
                <div className="px-3 py-1 bg-dark-border rounded-full">
                  {selectedPartner?.name || phoneNumber || "Partner"}
                </div>
              </div>
            </motion.div>

            <div className="bg-atomic-purple/10 border border-atomic-purple/30 rounded-xl p-4 text-sm text-center">
              <p className="text-[var(--text-secondary)]">
                Partner kamu akan menerima undangan via WhatsApp.
                Tim akan aktif setelah partner menerima undangan.
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen bg-dark-bg flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            aria-label="Kembali"
            onClick={handleBack}
            variant="ghost"
          />
          <h1 className="flex-1 text-lg font-bold">Buat Tim Baru</h1>
        </div>
        <StepProgress steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <RippleButton
          fullWidth
          size="lg"
          disabled={!canProceed()}
          isLoading={isLoading}
          loadingText="Membuat tim..."
          onClick={handleNext}
          rightIcon={
            currentStep === steps.length - 1 ? (
              <Check className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )
          }
        >
          {currentStep === steps.length - 1 ? "Buat Tim" : "Lanjut"}
        </RippleButton>
      </div>

      {/* Success celebration */}
      <CelebrationModal
        isOpen={showSuccess}
        onClose={() => router.push("/")}
        title="Tim Berhasil Dibuat!"
        message={`${teamName} siap bertanding. Undangan sudah dikirim ke partner kamu.`}
        icon="🎉"
        actionLabel="Mulai Bermain"
      />
    </motion.div>
  )
}
