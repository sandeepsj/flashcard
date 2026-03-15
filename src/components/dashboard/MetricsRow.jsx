import React from 'react'
import { Calendar, Zap, Flame, Layers } from 'lucide-react'
import Spinner from '../ui/Spinner'

function MetricCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value ?? '—'}</p>
        )}
      </div>
    </div>
  )
}

export default function MetricsRow({ dueToday, studiedToday, streak, totalCards, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard icon={Calendar} label="Due Today" value={dueToday} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" loading={loading} />
      <MetricCard icon={Zap} label="Studied Today" value={studiedToday} color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" loading={loading} />
      <MetricCard icon={Flame} label="Day Streak" value={streak} color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" loading={loading} />
      <MetricCard icon={Layers} label="Total Cards" value={totalCards} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" loading={loading} />
    </div>
  )
}
