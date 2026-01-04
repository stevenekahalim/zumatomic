import { Header } from "@/components/shared/Header"
import { BottomNav } from "@/components/shared/BottomNav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <main className="pb-safe">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
