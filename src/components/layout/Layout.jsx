import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Zap, Download, X } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileDrawer from './MobileDrawer'
import OfflineBanner from '../ui/OfflineBanner'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowInstall(false)
    setInstallPrompt(null)
  }

  return (
    <div className="flex min-h-screen bg-base text-text app-bg">
      <OfflineBanner />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-base/80 backdrop-blur-xl border-b border-line/60 sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-full text-muted hover:text-text transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary grid place-items-center">
              <Zap className="w-3.5 h-3.5 text-on-primary" fill="currentColor" />
            </div>
            <span className="font-display font-bold tracking-tight">FlashDSA</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Install banner */}
        {showInstall && (
          <div className="flex items-center justify-between gap-3 mx-4 mt-3 px-4 py-2.5 rounded-2xl bg-primary text-on-primary text-sm shadow-lg shadow-primary/20">
            <span className="flex items-center gap-2 font-medium">
              <Download className="w-4 h-4 shrink-0" />
              Install FlashDSA for offline study
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handleInstall} className="font-bold underline underline-offset-2">Install</button>
              <button onClick={() => setShowInstall(false)} className="p-1 opacity-70 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 pb-32 lg:pb-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
