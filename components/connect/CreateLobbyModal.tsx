"use client"

import { useState } from "react"
import { X, Calendar, Clock, MapPin, Swords, Trophy, FileText, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CreateLobbyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LobbyFormData) => void
}

interface LobbyFormData {
  type: "RANKED" | "LEAGUE"
  customTitle: string
  date: string
  time: string
  duration: number
  locationType: "VENUE" | "FLEXIBLE"
  locationName: string
  minMmr?: number
  maxMmr?: number
  notes: string
}

const DURATION_OPTIONS = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
]

export function CreateLobbyModal({ isOpen, onClose, onSubmit }: CreateLobbyModalProps) {
  const [formData, setFormData] = useState<LobbyFormData>({
    type: "RANKED",
    customTitle: "",
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    duration: 2,
    locationType: "FLEXIBLE",
    locationName: "",
    notes: "",
  })

  const handleSubmit = () => {
    if (!formData.customTitle.trim()) {
      alert("Please enter a title")
      return
    }
    if (!formData.locationName.trim()) {
      alert("Please enter a location")
      return
    }
    onSubmit(formData)
    onClose()
  }

  const updateField = <K extends keyof LobbyFormData>(field: K, value: LobbyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-3xl bg-[var(--bg-elevated)]"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-[var(--color-toxic)]" />
                <h2 className="text-lg font-bold">Create Lobby</h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-160px)] px-5 py-4 space-y-5">
              {/* Type Toggle */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField("type", "RANKED")}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                      formData.type === "RANKED"
                        ? "bg-[var(--color-toxic)] text-black"
                        : "glass-card text-[var(--text-secondary)]"
                    )}
                  >
                    <Swords size={18} />
                    Ranked
                  </button>
                  <button
                    onClick={() => updateField("type", "LEAGUE")}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                      formData.type === "LEAGUE"
                        ? "bg-[var(--tier-legend)] text-black"
                        : "glass-card text-[var(--text-secondary)]"
                    )}
                  >
                    <Trophy size={18} />
                    League
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                  Title (The Hook)
                </label>
                <input
                  type="text"
                  placeholder="Ada yang mau main?"
                  value={formData.customTitle}
                  onChange={(e) => updateField("customTitle", e.target.value)}
                  className="w-full h-12 px-4 rounded-xl glass-card border-0 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                  maxLength={60}
                />
                <p className="text-[10px] text-[var(--text-tertiary)] mt-1 text-right">
                  {formData.customTitle.length}/60
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl glass-card border-0 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock size={12} />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField("time", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl glass-card border-0 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                  Duration
                </label>
                <div className="flex gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateField("duration", opt.value)}
                      className={cn(
                        "flex-1 h-10 rounded-lg text-sm font-medium transition-all",
                        formData.duration === opt.value
                          ? "bg-[var(--color-toxic)] text-black"
                          : "glass-card text-[var(--text-secondary)]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={12} />
                  Location
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => updateField("locationType", "VENUE")}
                    className={cn(
                      "flex-1 h-9 rounded-lg text-xs font-medium transition-all",
                      formData.locationType === "VENUE"
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-[var(--text-secondary)]"
                    )}
                  >
                    Specific Venue
                  </button>
                  <button
                    onClick={() => updateField("locationType", "FLEXIBLE")}
                    className={cn(
                      "flex-1 h-9 rounded-lg text-xs font-medium transition-all",
                      formData.locationType === "FLEXIBLE"
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-[var(--text-secondary)]"
                    )}
                  >
                    Flexible Area
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={formData.locationType === "VENUE" ? "e.g., PALAS Tennis Club" : "e.g., Jakarta Barat"}
                  value={formData.locationName}
                  onChange={(e) => updateField("locationName", e.target.value)}
                  className="w-full h-12 px-4 rounded-xl glass-card border-0 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                />
              </div>

              {/* Level Constraints (Optional) */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                  Level Constraint (Optional)
                </label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="text-[10px] text-[var(--text-tertiary)] mb-1 block">Min MMR</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      placeholder="0.0"
                      value={formData.minMmr || ""}
                      onChange={(e) => updateField("minMmr", e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full h-10 px-3 rounded-lg glass-card border-0 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                    />
                  </div>
                  <span className="text-[var(--text-tertiary)] pt-4">—</span>
                  <div className="flex-1">
                    <label className="text-[10px] text-[var(--text-tertiary)] mb-1 block">Max MMR</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      placeholder="5.0"
                      value={formData.maxMmr || ""}
                      onChange={(e) => updateField("maxMmr", e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full h-10 px-3 rounded-lg glass-card border-0 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)]"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText size={12} />
                  Notes
                </label>
                <textarea
                  placeholder="Best of three. Competitive play."
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl glass-card border-0 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-toxic)] resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-5 py-4 border-t border-white/10">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-[var(--color-toxic)] text-black text-sm font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Create Lobby
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
