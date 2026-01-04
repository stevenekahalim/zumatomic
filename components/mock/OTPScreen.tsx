"use client"

import { motion } from "framer-motion"
import { Signal, Wifi, Battery, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface OTPScreenProps {
  phoneNumber?: string
  otpCode?: string
  className?: string
}

export function OTPScreen({
  phoneNumber = "+62 812 3456 7890",
  otpCode = "123456",
  className,
}: OTPScreenProps) {
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className={cn(
        "w-[360px] h-[640px] bg-black rounded-[40px] p-3 relative overflow-hidden",
        className
      )}
    >
      {/* Phone frame */}
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[32px] overflow-hidden relative">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 text-white text-xs">
          <span className="font-semibold">{currentTime}</span>
          <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Lock screen content */}
        <div className="flex flex-col items-center pt-20 px-6">
          {/* Lock icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="mb-4"
          >
            <Lock className="w-8 h-8 text-white/60" />
          </motion.div>

          {/* Date */}
          <p className="text-white/60 text-sm mb-2">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          {/* Time */}
          <h1 className="text-7xl font-thin text-white mb-8">{currentTime}</h1>

          {/* Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
          >
            {/* App header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-atomic-purple to-atomic-pink flex items-center justify-center text-white font-black text-sm">
                Z
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">
                    ZUMATOMIC
                  </span>
                  <span className="text-white/60 text-xs">now</span>
                </div>
                <p className="text-white/60 text-xs">Verification</p>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <p className="text-white text-sm">
                🔐 Kode verifikasi ZUMATOMIC kamu:
              </p>
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-3xl font-bold text-atomic-purple tracking-wider"
              >
                {otpCode}
              </motion.p>
              <p className="text-white/60 text-xs">
                Jangan bagikan kode ini ke siapapun.
              </p>
            </div>
          </motion.div>

          {/* Additional notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full mt-3 bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">WhatsApp</p>
                <p className="text-white/60 text-xs">
                  ZUMATOMIC: Kode OTP kamu adalah {otpCode}
                </p>
              </div>
              <span className="text-white/40 text-xs">now</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-16">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/60 rounded-full" />
      </div>
    </div>
  )
}
