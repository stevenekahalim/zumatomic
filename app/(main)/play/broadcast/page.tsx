"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Megaphone, MapPin, Clock, Send, Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"

// Location options for LFO broadcast
const LOCATION_OPTIONS = {
  WEST: { name: "Jakarta Barat", label: "Barat" },
  EAST: { name: "Jakarta Timur", label: "Timur" },
  CENTER: { name: "Jakarta Pusat", label: "Pusat" },
} as const

export default function BroadcastPage() {
  const router = useRouter()
  const [location, setLocation] = useState<keyof typeof LOCATION_OPTIONS | "">("")
  const [time, setTime] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateReclubText = () => {
    const locationName = location ? LOCATION_OPTIONS[location].name : ""
    return `🎾 ZUMATOMIC LFO 🎾

📍 Lokasi: ${locationName}
⏰ Waktu: ${time}
💬 ${message}

#Zumatomic #PadelJakarta #LFO`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateReclubText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ padding: 'var(--page-padding)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-toxic)]/20 flex items-center justify-center"
          >
            <Check size={40} className="text-[var(--color-toxic)]" />
          </motion.div>
          <h2 className="text-xl font-bold mb-2">Broadcast Terkirim!</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            LFO kamu sudah masuk ke Match Market
          </p>
          <RippleButton onClick={() => router.push("/lobby")}>
            Lihat di Lobby
          </RippleButton>
        </motion.div>
      </div>
    )
  }

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
            <Megaphone size={20} className="text-[var(--tier-legend)]" />
            Broadcast LFO
          </h1>
        </div>
      </div>

      <div
        className="max-w-[var(--content-max-width)] mx-auto py-6"
        style={{ paddingLeft: 'var(--page-padding)', paddingRight: 'var(--page-padding)' }}
      >
        {/* Form */}
        <div className="space-y-5">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              <MapPin size={16} className="inline mr-1.5" />
              Lokasi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(LOCATION_OPTIONS) as [keyof typeof LOCATION_OPTIONS, typeof LOCATION_OPTIONS[keyof typeof LOCATION_OPTIONS]][]).map(([key, loc]) => (
                <button
                  key={key}
                  onClick={() => setLocation(key)}
                  className={cn(
                    "h-12 rounded-xl text-sm font-medium transition-all",
                    location === key
                      ? "bg-[var(--color-toxic)] text-black"
                      : "glass-card text-[var(--text-secondary)] hover:text-white"
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              <Clock size={16} className="inline mr-1.5" />
              Waktu Main
            </label>
            <input
              type="text"
              placeholder="contoh: Sabtu, 18 Jan 2025 - 19:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Pesan (opsional)
            </label>
            <textarea
              placeholder="Tulis pesan tambahan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Preview */}
          {(location || time) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Preview untuk Reclub
                </span>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    copied
                      ? "bg-[var(--color-toxic)] text-black"
                      : "bg-white/10 text-[var(--text-secondary)] hover:text-white"
                  )}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-sans">
                {generateReclubText()}
              </pre>
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <RippleButton
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            loadingText="Mengirim..."
            onClick={handleSubmit}
            disabled={!location || !time}
            leftIcon={<Send size={20} />}
          >
            Broadcast ke Lobby
          </RippleButton>
        </div>
      </div>
    </div>
  )
}
