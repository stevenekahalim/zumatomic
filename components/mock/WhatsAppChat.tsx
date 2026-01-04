"use client"

import { motion } from "framer-motion"
import { Check, CheckCheck, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  message: string
  time: string
  isOwn?: boolean
  status?: "sent" | "delivered" | "read"
  isFirst?: boolean
}

function ChatBubble({
  message,
  time,
  isOwn = false,
  status = "read",
  isFirst = false,
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-3 py-2 rounded-lg relative",
          isOwn
            ? "bg-[#005C4B] rounded-tr-none"
            : "bg-[#202C33] rounded-tl-none"
        )}
      >
        {/* Bubble tail */}
        {isFirst && (
          <div
            className={cn(
              "absolute top-0 w-3 h-3",
              isOwn
                ? "right-[-8px] border-l-[8px] border-l-[#005C4B] border-t-[8px] border-t-transparent"
                : "left-[-8px] border-r-[8px] border-r-[#202C33] border-t-[8px] border-t-transparent"
            )}
          />
        )}

        <p className="text-[15px] text-white whitespace-pre-wrap">{message}</p>

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-white/60">{time}</span>
          {isOwn && (
            <span className={status === "read" ? "text-[#53BDEB]" : "text-white/60"}>
              {status === "sent" ? (
                <Check className="w-4 h-4" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface WhatsAppChatProps {
  contactName: string
  contactStatus?: string
  messages: Array<{
    message: string
    time: string
    isOwn?: boolean
    status?: "sent" | "delivered" | "read"
  }>
  className?: string
}

export function WhatsAppChat({
  contactName,
  contactStatus = "online",
  messages,
  className,
}: WhatsAppChatProps) {
  return (
    <div
      className={cn(
        "w-[360px] h-[640px] bg-[#0B141A] rounded-2xl overflow-hidden border border-dark-border",
        className
      )}
    >
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3">
        <ArrowLeft className="w-6 h-6 text-white/80" />
        <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-bold">
          {contactName[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{contactName}</p>
          <p className="text-xs text-[#8696A0]">{contactStatus}</p>
        </div>
        <Video className="w-6 h-6 text-white/80 mr-4" />
        <Phone className="w-6 h-6 text-white/80 mr-4" />
        <MoreVertical className="w-6 h-6 text-white/80" />
      </div>

      {/* Chat background pattern */}
      <div
        className="flex-1 p-4 space-y-2 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "#0B141A",
          height: "calc(100% - 128px)",
        }}
      >
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            {...msg}
            isFirst={index === 0 || messages[index - 1]?.isOwn !== msg.isOwn}
          />
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#202C33] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 flex items-center">
          <span className="text-[#8696A0]">Type a message</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Challenge message template
export function WhatsAppChallengePreview() {
  return (
    <WhatsAppChat
      contactName="Alpha Strike"
      contactStatus="online"
      messages={[
        {
          message: "Halo! 👋",
          time: "10:30",
          isOwn: false,
        },
        {
          message:
            "Tim kami mau tantang kalian main padel!\n\n🎾 *ZUMATOMIC Challenge*\n\nAlpha Strike vs Beta Force\n\nKapan ada waktu? 🔥",
          time: "10:31",
          isOwn: false,
        },
        {
          message: "Siap! Sabtu jam 10 pagi gimana?",
          time: "10:35",
          isOwn: true,
          status: "read",
        },
        {
          message: "Deal! See you on court! 🏆",
          time: "10:36",
          isOwn: false,
        },
      ]}
    />
  )
}

// OTP message preview
export function WhatsAppOTPPreview() {
  return (
    <WhatsAppChat
      contactName="ZUMATOMIC"
      contactStatus="verified business"
      messages={[
        {
          message:
            "🔐 *Kode Verifikasi ZUMATOMIC*\n\nKode OTP kamu adalah: *123456*\n\nJangan bagikan kode ini ke siapapun.\n\nKode berlaku 5 menit.",
          time: "10:30",
          isOwn: false,
        },
      ]}
    />
  )
}

// Verification message preview
export function WhatsAppVerificationPreview() {
  return (
    <WhatsAppChat
      contactName="Beta Force"
      contactStatus="typing..."
      messages={[
        {
          message:
            "✅ *Hasil Match Submitted*\n\n🏆 Alpha Strike vs Beta Force\n📊 Skor: 3 - 1\n\nMenunggu verifikasi dari Beta Force...",
          time: "15:30",
          isOwn: true,
          status: "delivered",
        },
      ]}
    />
  )
}
