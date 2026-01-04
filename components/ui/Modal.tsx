"use client"

import { ReactNode, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { fadeVariants, scaleVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "full"
  showClose?: boolean
  closeOnOverlay?: boolean
  className?: string
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-[95vw] max-h-[95vh]",
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  className,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            variants={scaleVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={cn(
              "relative w-full bg-dark-card border border-dark-border rounded-2xl shadow-xl",
              sizes[size],
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between p-4 border-b border-dark-border">
                <div>
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-lg font-semibold text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 -mt-1 rounded-lg hover:bg-dark-border transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-[var(--text-secondary)]" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Dialog component for confirmations
interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
  isLoading?: boolean
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "default",
  isLoading = false,
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-[var(--text-secondary)] mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-dark-border rounded-xl font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl font-medium transition-colors disabled:opacity-50",
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-atomic-purple hover:bg-opacity-80"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
