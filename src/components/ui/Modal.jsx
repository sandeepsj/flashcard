import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/** Bottom sheet on mobile, centered dialog on larger screens. */
export default function Modal({ open, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet / dialog */}
      <div
        className={`relative w-full bg-surface border border-line rounded-t-3xl sm:rounded-3xl shadow-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 animate-sheet ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-line" />

        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="font-display text-lg font-bold tracking-tight text-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-muted hover:text-text hover:bg-raised transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
