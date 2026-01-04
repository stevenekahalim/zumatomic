"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Users, Trophy, TrendingUp, Zap } from "lucide-react"
import { RippleButton } from "@/components/ui/RippleButton"
import { Confetti } from "@/components/animations/Confetti"

const slides = [
  {
    icon: <Trophy size={48} />,
    title: "Selamat Datang!",
    description: "ZUMATOMIC adalah liga padel amatir berbasis pasangan (pairs) pertama di Indonesia.",
    color: "from-[#22C55E] to-[#4ADE80]",
  },
  {
    icon: <Users size={48} />,
    title: "Bentuk Tim Kamu",
    description: "Buat tim dengan partner kamu. Satu tim = dua pemain yang akan bertanding bersama.",
    color: "from-[#4ADE80] to-[#86EFAC]",
  },
  {
    icon: <TrendingUp size={48} />,
    title: "Naik Peringkat",
    description: "Menang untuk naik MMR dan tier. Capai Mythic untuk jadi legenda!",
    color: "from-atomic-yellow to-orange-500",
  },
  {
    icon: <Zap size={48} />,
    title: "Mulai Sekarang!",
    description: "Siap bertanding? Ayo mulai petualangan padel kamu!",
    color: "from-[#22C55E] to-[#4ADE80]",
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showConfetti] = useState(true)

  const isLastSlide = currentSlide === slides.length - 1

  const handleNext = () => {
    if (isLastSlide) {
      router.push("/")
    } else {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ padding: 'var(--page-padding)' }}
    >
      <Confetti isActive={showConfetti} pieceCount={30} duration={2000} />

      {/* Skip button */}
      {!isLastSlide && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSkip}
          className="self-end text-[14px] text-[var(--text-secondary)] hover:text-white transition-colors min-h-[44px] px-2"
        >
          Lewati
        </motion.button>
      )}

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", damping: 12 }}
              className="relative mx-auto mb-8"
            >
              {/* Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} rounded-full blur-3xl opacity-30 scale-150`}
              />

              {/* Icon container */}
              <div
                className={`relative w-[120px] h-[120px] rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center text-white shadow-xl`}
              >
                {slides[currentSlide].icon}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[24px] font-bold mb-3"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[15px] text-[var(--text-secondary)] max-w-[280px] mx-auto leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2.5 mb-8">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            animate={{
              width: currentSlide === index ? 24 : 8,
              backgroundColor:
                currentSlide === index ? "var(--accent-primary)" : "rgba(74,222,128,0.2)",
            }}
            className="h-2.5 rounded-full transition-colors min-h-[44px] flex items-center"
          />
        ))}
      </div>

      {/* Next button */}
      <RippleButton
        fullWidth
        size="lg"
        onClick={handleNext}
        rightIcon={<ArrowRight size={18} />}
        variant={isLastSlide ? "primary" : "secondary"}
      >
        {isLastSlide ? "Mulai Bermain" : "Lanjut"}
      </RippleButton>
    </div>
  )
}
