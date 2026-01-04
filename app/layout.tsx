import type { Metadata, Viewport } from "next"
import { Inter, Space_Mono } from "next/font/google"
import { ToastProvider } from "@/components/providers/ToastProvider"
import { ErrorBoundary } from "@/components/providers/ErrorBoundary"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "ZUMATOMIC - Liga Padel Amatir",
  description: "Liga Padel Amatir berbasis Pasangan - The Mobile Legends of Padel",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZUMATOMIC",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
