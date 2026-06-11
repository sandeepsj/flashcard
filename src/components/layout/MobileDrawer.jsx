import React, { useEffect } from 'react'
import { X, LogOut, Sun, Moon, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function MobileDrawer({ open, onClose }) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-surface border-r border-line shadow-card transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary grid place-items-center">
              <Zap className="w-4 h-4 text-on-primary" fill="currentColor" />
            </div>
            <span className="font-display font-bold tracking-tight">FlashDSA</span>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-muted hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-raised rounded-2xl border border-line">
              <img
                src={user.photoURL || ''}
                alt={user.displayName}
                className="w-9 h-9 rounded-full bg-base"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.displayName}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium text-muted hover:bg-raised hover:text-text transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={async () => { await signOut(); onClose() }}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
