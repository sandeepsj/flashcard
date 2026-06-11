import React from 'react'
import { useNavigate } from 'react-router-dom'
import { isMastered, todayMidnight } from '../../lib/sm2'

export default function TopicProgressList({ topics, cards }) {
  const navigate = useNavigate()
  const today = todayMidnight()

  const rows = topics.map((t) => {
    const topicCards = cards.filter((c) => c.topicId === t.id)
    const mastered = topicCards.filter(isMastered).length
    const due = topicCards.filter((c) => {
      const d = new Date(c.nextReviewDate || 0)
      return d <= today
    }).length
    const total = topicCards.length
    const pct = total > 0 ? mastered / total : 0

    return { ...t, mastered, due, total, pct }
  }).sort((a, b) => b.total - a.total)

  if (rows.length === 0) return null

  return (
    <div className="space-y-3">
      {rows.map((t) => (
        <button
          key={t.id}
          onClick={() => navigate(`/topics/${t.id}`)}
          className="w-full rounded-2xl border border-line bg-surface p-4 text-left hover:border-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold truncate">{t.name}</span>
            <div className="flex items-center gap-3 font-mono text-xs text-muted shrink-0 ml-2">
              <span>{t.mastered}/{t.total} mastered</span>
              {t.due > 0 && (
                <span className="bg-amber-400/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                  {t.due} due
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-raised rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${t.pct * 100}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  )
}
