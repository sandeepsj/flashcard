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
          className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{t.name}</span>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
              <span>{t.mastered}/{t.total} mastered</span>
              {t.due > 0 && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                  {t.due} due
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${t.pct * 100}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  )
}
