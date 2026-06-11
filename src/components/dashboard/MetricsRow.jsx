import React from 'react'
import { Calendar, Zap, Flame, Layers } from 'lucide-react'
import Spinner from '../ui/Spinner'

function MetricCard({ icon: Icon, label, value, iconClass, loading, delay }) {
  return (
    <div
      className="rounded-3xl border border-line bg-surface p-4 animate-rise"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <p className="font-mono text-3xl font-semibold tracking-tight">{value ?? '—'}</p>
      )}
    </div>
  )
}

export default function MetricsRow({ dueToday, studiedToday, streak, totalCards, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard icon={Calendar} label="Due Today" value={dueToday} iconClass="text-amber-500 dark:text-amber-400" loading={loading} delay="60ms" />
      <MetricCard icon={Zap} label="Studied" value={studiedToday} iconClass="text-accent" loading={loading} delay="120ms" />
      <MetricCard icon={Flame} label="Streak" value={streak} iconClass="text-orange-500 dark:text-orange-400" loading={loading} delay="180ms" />
      <MetricCard icon={Layers} label="Cards" value={totalCards} iconClass="text-muted" loading={loading} delay="240ms" />
    </div>
  )
}
