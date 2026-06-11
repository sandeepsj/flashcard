import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
  success: <CheckCircle className="w-5 h-5 text-accent" />,
  error: <XCircle className="w-5 h-5 text-coral" />,
  info: <AlertCircle className="w-5 h-5 text-muted" />,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timerRef = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timerRef.current[id])
    setToasts((ts) => ts.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts, { id, message, type }])
    timerRef.current[id] = setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4 lg:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 bg-raised/95 backdrop-blur-xl shadow-float rounded-2xl border border-line px-4 py-3 animate-slide-up"
          >
            {icons[t.type]}
            <p className="flex-1 text-sm font-medium text-text">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-muted hover:text-text transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
