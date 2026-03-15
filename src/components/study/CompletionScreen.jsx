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
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Session Complete!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Finished in {formatTime(elapsedSeconds)}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.got}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Got It</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">{stats.missed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Missed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{pct}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correct</p>
        </div>
      </div>

      <div className="flex gap-3">
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
