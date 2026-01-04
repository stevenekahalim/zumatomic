"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Phone, ArrowRight, Shield } from "lucide-react"
import { RippleButton } from "@/components/ui/RippleButton"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.startsWith("62")) {
      return digits
    } else if (digits.startsWith("0")) {
      return "62" + digits.slice(1)
    }
    return digits
  }

  const displayNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (!digits) return ""

    let formatted = ""
    if (digits.length > 0) formatted += "+62 "
    if (digits.length > 2) formatted += digits.slice(2, 5)
    if (digits.length > 5) formatted += " " + digits.slice(5, 9)
    if (digits.length > 9) formatted += " " + digits.slice(9, 13)

    return formatted.trim()
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    if (raw.length <= 15) {
      setPhoneNumber(formatPhoneNumber(raw))
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const digits = phoneNumber.replace(/\D/g, "")
    if (digits.length < 10) {
      setError("Nomor telepon tidak valid")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push(`/otp?phone=${encodeURIComponent(phoneNumber)}`)
  }

  const isValid = phoneNumber.replace(/\D/g, "").length >= 10

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col"
      style={{ padding: 'var(--page-padding)' }}
    >
      {/* Logo and branding */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col items-center justify-center"
      >
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          className="relative mb-8"
        >
          {/* Toxic glow effect */}
          <div className="absolute inset-0 bg-[var(--color-toxic)]/30 rounded-full blur-2xl scale-150" />

          {/* Logo container */}
          <div className="relative w-[88px] h-[88px] rounded-3xl bg-[var(--color-toxic)] flex items-center justify-center shadow-[var(--glow-toxic-intense)]">
            <span className="text-[36px] font-black text-[var(--bg-void)]">Z</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[28px] font-bold mb-2 gradient-text tracking-tight"
        >
          ZUMATOMIC
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[15px] text-[var(--text-secondary)] text-center mb-12"
        >
          Liga Padel Amatir #1 Indonesia
        </motion.p>
      </motion.div>

      {/* Login form */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Phone input */}
        <div>
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
            Nomor WhatsApp
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              value={displayNumber(phoneNumber)}
              onChange={handlePhoneChange}
              placeholder="+62 812 3456 7890"
              className={`
                input-field pl-12
                ${error ? "border-[var(--color-error)]" : ""}
              `}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--color-error)] text-[13px] mt-2"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Submit button */}
        <RippleButton
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingText="Mengirim OTP..."
          disabled={!isValid}
          rightIcon={<ArrowRight size={18} />}
        >
          Lanjutkan
        </RippleButton>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-[12px] text-[var(--text-secondary)]"
        >
          <Shield size={14} />
          <span>Kami akan mengirim kode OTP ke WhatsApp kamu</span>
        </motion.div>
      </motion.form>

      {/* Terms */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[12px] text-[var(--text-tertiary)] mt-8 mb-4 leading-relaxed"
      >
        Dengan melanjutkan, kamu menyetujui{" "}
        <span className="text-[var(--color-toxic)] font-medium">Syarat & Ketentuan</span> dan{" "}
        <span className="text-[var(--color-toxic)] font-medium">Kebijakan Privasi</span> kami.
      </motion.p>
    </motion.div>
  )
}
