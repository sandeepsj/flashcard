import React from 'react'
import { WifiOff } from 'lucide-react'
import { useOffline } from '../../hooks/useOffline'

export default function OfflineBanner() {
  const isOffline = useOffline()
  if (!isOffline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-sm px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span>You're offline — changes will sync when reconnected</span>
    </div>
  )
}
