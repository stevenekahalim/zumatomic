"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { pageVariants, fadeVariants, slideRightVariants } from "@/lib/animations"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  variant?: "page" | "fade" | "slide"
}

const variants = {
  page: pageVariants,
  fade: fadeVariants,
  slide: slideRightVariants,
}

export function PageTransition({
  children,
  className,
  variant = "page",
}: PageTransitionProps) {
  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

// For use with route changes
interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.main>
  )
}

// Section reveal animation (for scroll-based reveals)
interface RevealSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function RevealSection({
  children,
  delay = 0,
  className,
}: RevealSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Modal/Overlay transition wrapper
interface OverlayTransitionProps {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export function OverlayTransition({
  isOpen,
  children,
  className,
}: OverlayTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
