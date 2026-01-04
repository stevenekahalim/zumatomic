"use client"

import { ReactNode, useEffect } from "react"
import { motion, AnimatePresence, PanInfo, useDragControls } from "framer-motion"
import { fadeVariants, slideUpVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  snapPoints?: number[]
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  className,
}: BottomSheetProps) {
  const dragControls = useDragControls()

  // Lock body scroll when open
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

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Close if dragged down significantly
    if (info.velocity.y > 500 || info.offset.y > 200) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            variants={slideUpVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              "absolute bottom-0 left-0 right-0",
              "bg-dark-card border-t border-dark-border rounded-t-3xl",
              "max-h-[90vh] overflow-hidden",
              className
            )}
          >
            {/* Drag Handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-dark-border rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-4 pb-4 border-b border-dark-border">
                <h2 className="text-lg font-semibold text-center">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Action Sheet variant (for option menus)
interface ActionSheetOption {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: "default" | "danger"
}

interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  options: ActionSheetOption[]
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  options,
}: ActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              option.onClick()
              onClose()
            }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl transition-colors",
              option.variant === "danger"
                ? "text-red-500 hover:bg-red-500/10"
                : "text-white hover:bg-dark-border"
            )}
          >
            {option.icon}
            <span className="font-medium">{option.label}</span>
          </button>
        ))}

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full p-4 mt-2 rounded-xl bg-dark-border text-[var(--text-secondary)] font-medium hover:bg-opacity-80 transition-colors"
        >
          Batal
        </button>
      </div>
    </BottomSheet>
  )
}
