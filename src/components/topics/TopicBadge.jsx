import React from 'react'

/**
 * Shows card count and a small progress ring.
 * compact = true → tiny inline badge for sidebar
 */
export default function TopicBadge({ topic, compact = false }) {
  const total = topic.cardCount || 0
  const mastered = topic.masteredCount || 0
  const pct = total > 0 ? mastered / total : 0

  if (compact) {
    return (
      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">
        {total}
      </span>
    )
  }

  // Progress ring
  const r = 16
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
        <circle
          cx="20" cy="20" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          className="text-indigo-500 dark:text-indigo-400 transition-all duration-500"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{total} cards</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{mastered} mastered</p>
      </div>
    </div>
  )
}
