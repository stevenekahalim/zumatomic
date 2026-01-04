"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { toastVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/50",
    icon: "text-emerald-400",
    progress: "bg-emerald-500",
  },
  error: {
    bg: "bg-red-500/20",
    border: "border-red-500/50",
    icon: "text-red-400",
    progress: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/50",
    icon: "text-amber-400",
    progress: "bg-amber-500",
  },
  info: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    icon: "text-blue-400",
    progress: "bg-blue-500",
  },
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type]
  const style = styles[toast.type]
  const duration = toast.duration || 4000

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm",
        "min-w-[300px] max-w-[400px] shadow-lg",
        style.bg,
        style.border
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.icon)} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-white/70 mt-0.5">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-white/50" />
      </button>

      {/* Progress bar */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 h-1 rounded-b-xl",
          style.progress
        )}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        onAnimationComplete={() => onDismiss(toast.id)}
      />
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
