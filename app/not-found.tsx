"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Search } from "lucide-react"
import { RippleButton } from "@/components/ui/RippleButton"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6">
      {/* Gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-atomic-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-atomic-pink/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-sm"
      >
        {/* 404 Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="relative mb-8"
        >
          {/* Glow */}
          <div className="absolute inset-0 text-9xl font-black text-atomic-purple blur-xl opacity-30">
            404
          </div>
          <h1 className="relative text-9xl font-black gradient-text">404</h1>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center"
        >
          <Search className="w-10 h-10 text-[var(--text-secondary)]" />
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-2"
        >
          Halaman Tidak Ditemukan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[var(--text-secondary)] mb-8"
        >
          Ups! Sepertinya kamu tersesat. Halaman yang kamu cari tidak ada.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <RippleButton
            variant="secondary"
            size="lg"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => router.back()}
          >
            Kembali
          </RippleButton>
          <RippleButton
            variant="primary"
            size="lg"
            leftIcon={<Home className="w-5 h-5" />}
            onClick={() => router.push("/")}
          >
            Ke Beranda
          </RippleButton>
        </motion.div>
      </motion.div>
    </div>
  )
}
