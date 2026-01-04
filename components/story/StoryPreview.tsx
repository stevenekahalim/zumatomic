"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Download, Share2, X, Image as ImageIcon } from "lucide-react"
import { RippleButton, IconButton } from "@/components/ui/RippleButton"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/providers/ToastProvider"

interface StoryPreviewProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function StoryPreview({
  isOpen,
  onClose,
  children,
  title = "Preview Story",
}: StoryPreviewProps) {
  const storyRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const toast = useToast()

  const handleExport = async () => {
    if (!storyRef.current) return

    setIsExporting(true)

    try {
      // Dynamic import html-to-image
      const { toPng } = await import("html-to-image")

      const dataUrl = await toPng(storyRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })

      // Create download link
      const link = document.createElement("a")
      link.download = `zumatomic-story-${Date.now()}.png`
      link.href = dataUrl
      link.click()

      toast.success("Berhasil!", "Story berhasil diunduh")
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Gagal", "Tidak dapat mengunduh story")
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!storyRef.current) return

    setIsExporting(true)

    try {
      const { toPng } = await import("html-to-image")

      const dataUrl = await toPng(storyRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })

      // Convert to blob
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], "zumatomic-story.png", { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "ZUMATOMIC Match Result",
          text: "Check out my match result on ZUMATOMIC!",
        })
        toast.success("Berhasil!", "Story dibagikan")
      } else {
        // Fallback: download instead
        handleExport()
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share error:", error)
        toast.error("Gagal", "Tidak dapat membagikan story")
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" showClose={false}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <h2 className="text-lg font-bold">{title}</h2>
          <IconButton
            icon={<X className="w-5 h-5" />}
            aria-label="Close"
            onClick={onClose}
            variant="ghost"
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shadow-2xl rounded-2xl overflow-hidden"
          >
            <div ref={storyRef}>{children}</div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-dark-border space-y-3">
          <div className="flex gap-3">
            <RippleButton
              variant="secondary"
              size="lg"
              fullWidth
              leftIcon={<Download className="w-5 h-5" />}
              onClick={handleExport}
              isLoading={isExporting}
              loadingText="Mengunduh..."
            >
              Unduh
            </RippleButton>
            <RippleButton
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
              isLoading={isExporting}
              loadingText="Membagikan..."
            >
              Bagikan
            </RippleButton>
          </div>
          <p className="text-xs text-center text-[var(--text-secondary)]">
            Story akan disimpan sebagai gambar PNG untuk Instagram/WhatsApp Story
          </p>
        </div>
      </div>
    </Modal>
  )
}

// Quick story button for use in match cards
interface CreateStoryButtonProps {
  onClick: () => void
  size?: "sm" | "md"
  className?: string
}

export function CreateStoryButton({
  onClick,
  size = "md",
  className,
}: CreateStoryButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 bg-gradient-to-r from-atomic-purple to-atomic-pink
        text-white font-semibold rounded-xl hover:opacity-90 transition-opacity
        ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"}
        ${className}
      `}
    >
      <ImageIcon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      <span>Buat Story</span>
    </motion.button>
  )
}
