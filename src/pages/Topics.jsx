import React, { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import TopicModal from '../components/topics/TopicModal'
import Button from '../components/ui/Button'
import TopicBadge from '../components/topics/TopicBadge'
import { isMastered, todayMidnight } from '../lib/sm2'

export default function Topics() {
  const { topics } = useTopics()
  const { cards } = useCards()
  const navigate = useNavigate()
  const [modal, setModal] = useState({ open: false, mode: 'create', topic: null })

  const today = todayMidnight()

  function enrichTopic(t) {
    const tc = cards.filter((c) => c.topicId === t.id)
    const masteredCount = tc.filter(isMastered).length
    const dueCount = tc.filter((c) => {
      const d = new Date(c.nextReviewDate || 0)
      return d <= today
    }).length
    return { ...t, masteredCount, dueCount }
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Topics</h1>
        <Button onClick={() => setModal({ open: true, mode: 'create', topic: null })}>
          <Plus className="w-4 h-4" />
          New Topic
        </Button>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="mb-4">No topics yet. Create one to start organizing your cards.</p>
          <Button onClick={() => setModal({ open: true, mode: 'create', topic: null })}>
            Create Topic
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => {
            const enriched = enrichTopic(t)
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 flex-1 truncate"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    {t.name}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => setModal({ open: true, mode: 'rename', topic: t })}
                      className="p-1.5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setModal({ open: true, mode: 'delete', topic: t })}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <TopicBadge topic={enriched} />

                {enriched.dueCount > 0 && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/study?topic=${t.id}`)}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Study {enriched.dueCount} due
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <TopicModal
        mode={modal.mode}
        topic={modal.topic}
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </div>
  )
}
