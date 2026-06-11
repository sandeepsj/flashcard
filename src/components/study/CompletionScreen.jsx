import React from 'react'
import { CheckCircle, RotateCcw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function CompletionScreen({ stats, elapsedSeconds, onRestart }) {
  const navigate = useNavigate()
  const total = stats.got + stats.missed
  const pct = total > 0 ? Math.round((stats.got / total) * 100) : 0

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/30 grid place-items-center mb-6 animate-rise">
        <CheckCircle className="w-11 h-11 text-accent" />
      </div>

      <h2 className="font-display text-3xl font-bold tracking-tight mb-2 animate-rise" style={{ animationDelay: '80ms' }}>
        Session complete<span className="text-accent">.</span>
      </h2>
      <p className="font-mono text-sm text-muted mb-8 animate-rise" style={{ animationDelay: '140ms' }}>
        finished in {formatTime(elapsedSeconds)}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-sm animate-rise" style={{ animationDelay: '200ms' }}>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-mono text-2xl font-semibold text-accent">{stats.got}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mt-1.5">Got it</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-mono text-2xl font-semibold text-coral">{stats.missed}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mt-1.5">Missed</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="font-mono text-2xl font-semibold">{pct}%</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mt-1.5">Score</p>
        </div>
      </div>

      <div className="flex gap-3 animate-rise" style={{ animationDelay: '260ms' }}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <Home className="w-4 h-4" />
          Dashboard
        </Button>
        <Button onClick={onRestart}>
          <RotateCcw className="w-4 h-4" />
          Study Again
        </Button>
      </div>
    </div>
  )
}
