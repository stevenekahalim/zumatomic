"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bell,
  Shield,
  User,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  Share2,
  Star,
  MessageCircle,
} from "lucide-react"
import { IconButton } from "@/components/ui/RippleButton"
import { Dialog } from "@/components/ui/Modal"
import { pageVariants, staggerItemVariants } from "@/lib/animations"
import { StaggerList } from "@/components/animations/StaggerList"

interface SettingItem {
  icon: React.ReactNode
  label: string
  description?: string
  href?: string
  action?: () => void
  rightElement?: React.ReactNode
  variant?: "default" | "danger"
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

export default function SettingsPage() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const sections: SettingSection[] = [
    {
      title: "Akun",
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: "Edit Profil",
          description: "Ubah nama dan avatar",
          href: "/profile/edit",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          label: "Privasi",
          description: "Kelola visibilitas profil",
          href: "/settings/privacy",
        },
      ],
    },
    {
      title: "Preferensi",
      items: [
        {
          icon: <Bell className="w-5 h-5" />,
          label: "Notifikasi",
          description: "Atur notifikasi push",
          href: "/settings/notifications",
        },
        {
          icon: <Moon className="w-5 h-5" />,
          label: "Mode Gelap",
          description: "Selalu aktif",
          rightElement: (
            <div className="w-12 h-7 bg-atomic-purple rounded-full relative">
              <motion.div
                layout
                className="absolute top-1 w-5 h-5 bg-white rounded-full"
                animate={{ right: 4 }}
              />
            </div>
          ),
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          label: "Install Aplikasi",
          description: "Tambahkan ke homescreen",
          action: () => {
            // PWA install prompt would go here
          },
        },
      ],
    },
    {
      title: "Tentang",
      items: [
        {
          icon: <Star className="w-5 h-5" />,
          label: "Beri Rating",
          description: "Rate di Play Store",
          action: () => {},
        },
        {
          icon: <Share2 className="w-5 h-5" />,
          label: "Bagikan Aplikasi",
          action: () => {
            if (navigator.share) {
              navigator.share({
                title: "ZUMATOMIC",
                text: "Join liga padel amatir terkeren!",
                url: window.location.origin,
              })
            }
          },
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          label: "Hubungi Kami",
          description: "Bantuan & masukan",
          action: () => {
            window.open("https://wa.me/6281234567890", "_blank")
          },
        },
        {
          icon: <HelpCircle className="w-5 h-5" />,
          label: "Tentang ZUMATOMIC",
          description: "Versi 1.0.0",
          action: () => {},
        },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: <LogOut className="w-5 h-5" />,
          label: "Keluar",
          action: () => setShowLogoutDialog(true),
          variant: "danger",
        },
      ],
    },
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen bg-dark-bg pb-safe"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
        <div className="flex items-center gap-4 p-4">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            aria-label="Kembali"
            onClick={() => router.back()}
            variant="ghost"
          />
          <h1 className="text-lg font-bold">Pengaturan</h1>
        </div>
      </div>

      {/* Settings sections */}
      <div className="p-4 space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            {section.title && (
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-2 px-1">
                {section.title}
              </h2>
            )}
            <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden divide-y divide-dark-border">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => {
                    if (item.href) router.push(item.href)
                    else if (item.action) item.action()
                  }}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-dark-border/30 transition-colors text-left ${
                    item.variant === "danger" ? "text-red-500" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.variant === "danger"
                        ? "bg-red-500/10"
                        : "bg-dark-border"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.rightElement || (
                    <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logout dialog */}
      <Dialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => router.push("/login")}
        title="Keluar dari Akun?"
        message="Kamu perlu login lagi untuk mengakses aplikasi."
        confirmText="Ya, Keluar"
        variant="danger"
      />
    </motion.div>
  )
}
