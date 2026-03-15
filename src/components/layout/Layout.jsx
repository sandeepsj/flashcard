import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <OfflineBanner />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">FlashDSA</span>
          <div className="w-9" />
        </header>

        {/* Install banner */}
        {showInstall && (
          <div className="flex items-center justify-between px-4 py-2 bg-indigo-600 text-white text-sm">
            <span>Install FlashDSA as an app for offline access</span>
            <div className="flex gap-2">
              <button onClick={handleInstall} className="font-semibold underline">Install</button>
              <button onClick={() => setShowInstall(false)} className="opacity-70">×</button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
