"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, CheckCircle } from "lucide-react"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"

function OTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") || "+62 812 3456 7890"

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit) && index === 5) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (code === "123456") {
      setIsVerified(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/register")
    } else {
      setError("Kode OTP salah. Silakan coba lagi.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    if (!canResend) return

    setCanResend(false)
    setResendTimer(30)
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

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
        <h1 className="text-[20px] font-bold">Verifikasi OTP</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isVerified ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-[var(--accent-primary)]" />
            </motion.div>
            <h2 className="text-[20px] font-bold mb-2">Berhasil!</h2>
            <p className="text-[15px] text-[var(--text-secondary)]">Kode OTP terverifikasi</p>
          </motion.div>
        ) : (
          <>
            {/* Phone number display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-[15px] text-[var(--text-secondary)] mb-2">
                Masukkan kode 6 digit yang dikirim ke
              </p>
              <p className="text-[17px] font-semibold">{phone}</p>
            </motion.div>

            {/* OTP inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2.5 mb-8"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => {inputRefs.current[index] = el}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`
                    w-[48px] h-[56px] text-center text-[24px] font-bold rounded-xl
                    glass-card border-2 transition-all
                    focus:outline-none focus:ring-0
                    ${digit
                      ? "border-[var(--accent-primary)] text-white"
                      : error
                        ? "border-red-500"
                        : "text-white"
                    }
                    ${isLoading ? "opacity-50" : ""}
                  `}
                  disabled={isLoading}
                />
              ))}
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[13px] mb-6 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[12px] text-[var(--text-secondary)] mb-8 text-center leading-relaxed"
            >
              Cek WhatsApp kamu untuk kode OTP
              <br />
              <span className="text-[var(--accent-primary)] font-medium">(Gunakan 123456 untuk demo)</span>
            </motion.p>

            {/* Resend button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="flex items-center gap-2 text-[14px] text-[var(--accent-primary)] font-medium min-h-[44px] px-4"
                >
                  <RefreshCw size={16} />
                  Kirim Ulang Kode
                </button>
              ) : (
                <p className="text-[var(--text-secondary)] text-[14px]">
                  Kirim ulang dalam{" "}
                  <span className="font-mono font-bold text-white">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Manual submit button (fallback) */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <RippleButton
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Memverifikasi..."
            disabled={!otp.every((digit) => digit) || isLoading}
            onClick={() => handleVerify(otp.join(""))}
          >
            Verifikasi
          </RippleButton>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] rounded-full animate-spin" />
      </div>
    }>
      <OTPContent />
    </Suspense>
  )
}
