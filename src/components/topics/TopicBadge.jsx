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
      <span className="font-mono text-[10px] font-semibold text-muted bg-raised px-2 py-0.5 rounded-full">
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
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-raised" />
        <circle
          cx="20" cy="20" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="text-accent transition-all duration-500"
        />
      </svg>
      <div>
        <p className="font-mono text-sm font-semibold">{total} cards</p>
        <p className="text-xs text-muted">{mastered} mastered</p>
      </div>
    </div>
  )
}
