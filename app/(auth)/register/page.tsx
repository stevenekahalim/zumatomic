"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Camera, Check } from "lucide-react"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"

const avatarOptions = [
  { id: 1, emoji: "🎾", bg: "from-[#22C55E] to-[#4ADE80]" },
  { id: 2, emoji: "🏆", bg: "from-atomic-yellow to-orange-500" },
  { id: 3, emoji: "⚡", bg: "from-atomic-cyan to-blue-500" },
  { id: 4, emoji: "🔥", bg: "from-red-500 to-orange-500" },
  { id: 5, emoji: "💎", bg: "from-purple-500 to-pink-500" },
  { id: 6, emoji: "🌟", bg: "from-yellow-400 to-amber-500" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim().length < 2) {
      setError("Nama minimal 2 karakter")
      return
    }

    if (!selectedAvatar) {
      setError("Pilih avatar kamu")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/welcome")
  }

  const isValid = name.trim().length >= 2 && selectedAvatar !== null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
      style={{ padding: 'var(--page-padding)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <IconButton
          icon={<ArrowLeft size={20} />}
          aria-label="Kembali"
          onClick={() => router.back()}
          variant="ghost"
        />
        <h1 className="text-[20px] font-bold">Buat Profil</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Avatar selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-[15px] text-[var(--text-secondary)] mb-6">Pilih avatar kamu</p>

          {/* Selected avatar preview */}
          <motion.div
            layout
            className="relative w-[88px] h-[88px] mx-auto mb-6"
          >
            {selectedAvatar ? (
              <motion.div
                key={selectedAvatar}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-full h-full rounded-3xl bg-gradient-to-br ${avatarOptions.find((a) => a.id === selectedAvatar)?.bg
                  } flex items-center justify-center text-[36px] shadow-lg`}
              >
                {avatarOptions.find((a) => a.id === selectedAvatar)?.emoji}
              </motion.div>
            ) : (
              <div className="w-full h-full rounded-3xl glass-card border-2 border-dashed flex items-center justify-center">
                <Camera size={28} className="text-[var(--text-tertiary)]" />
              </div>
            )}
          </motion.div>

          {/* Avatar options */}
          <div className="flex justify-center gap-2.5 flex-wrap">
            {avatarOptions.map((avatar, index) => (
              <motion.button
                key={avatar.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedAvatar(avatar.id)
                  setError("")
                }}
                className={`
                  relative w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${avatar.bg}
                  flex items-center justify-center text-[22px]
                  transition-all
                  ${selectedAvatar === avatar.id
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--dark-bg)]"
                    : "opacity-70 hover:opacity-100"
                  }
                `}
              >
                {avatar.emoji}
                {selectedAvatar === avatar.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-md"
                  >
                    <Check size={12} className="text-[#0A1A14]" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 flex-1"
        >
          {/* Name input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
              Nama Tampilan
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                <User size={20} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                placeholder="Masukkan nama kamu"
                maxLength={20}
                className={`
                  w-full h-14 pl-12 pr-14 glass-card
                  text-[15px] text-white placeholder:text-[var(--text-tertiary)]
                  focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/30
                  transition-all
                  ${error ? "border-red-500" : ""}
                `}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--text-tertiary)]">
                {name.length}/20
              </span>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[13px] mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4"
          >
            <h3 className="font-medium text-[13px] mb-2">Tips:</h3>
            <ul className="text-[12px] text-[var(--text-secondary)] space-y-1 leading-relaxed">
              <li>• Gunakan nama yang mudah diingat teman-teman kamu</li>
              <li>• Nama ini akan tampil di leaderboard dan profil tim</li>
              <li>• Kamu bisa mengubah nama ini nanti di pengaturan</li>
            </ul>
          </motion.div>
        </motion.form>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <RippleButton
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Menyimpan..."
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Buat Profil
          </RippleButton>
        </motion.div>
      </div>
    </motion.div>
  )
}
