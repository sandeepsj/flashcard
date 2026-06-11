import React from 'react'
import { WifiOff } from 'lucide-react'
import { useOffline } from '../../hooks/useOffline'

export default function OfflineBanner() {
  const isOffline = useOffline()
  if (!isOffline) return null

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-2 rounded-full bg-amber-400 text-amber-950 text-xs font-semibold px-4 py-2 shadow-float animate-slide-up">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline — changes sync when reconnected</span>
      </div>
    </div>
  )
}
