"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { ToastContainer, ToastData, ToastType } from "@/components/ui/Toast"

interface ToastContextValue {
  toasts: ToastData[]
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      const id = `toast-${++toastId}`
      const newToast: ToastData = { id, type, title, message, duration }

      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  const success = useCallback(
    (title: string, message?: string) => showToast("success", title, message),
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string) => showToast("error", title, message),
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => showToast("warning", title, message),
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string) => showToast("info", title, message),
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
