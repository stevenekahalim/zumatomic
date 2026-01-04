"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient blob */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-atomic-purple/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-atomic-pink/10 rounded-full blur-3xl" />

        {/* Bottom gradient blob */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-atomic-cyan/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
