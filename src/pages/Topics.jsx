import React, { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, Layers } from 'lucide-react'
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
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-5">
      <div className="flex items-end justify-between pt-2 animate-rise">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Topics<span className="text-accent">.</span>
        </h1>
        <Button onClick={() => setModal({ open: true, mode: 'create', topic: null })}>
          <Plus className="w-4 h-4" />
          New Topic
        </Button>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-accent/40 bg-accent/5 p-10 text-center animate-rise" style={{ animationDelay: '100ms' }}>
          <Layers className="w-8 h-8 text-accent mx-auto mb-4" />
          <p className="font-display text-xl font-bold mb-2">No topics yet</p>
          <p className="text-sm text-muted mb-6">Create one to start organizing your cards</p>
          <Button onClick={() => setModal({ open: true, mode: 'create', topic: null })}>
            Create Topic
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t, i) => {
            const enriched = enrichTopic(t)
            return (
              <div
                key={t.id}
                className="rounded-3xl border border-line bg-surface p-5 hover:border-accent/50 transition-colors animate-rise"
                style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="font-display font-bold tracking-tight cursor-pointer hover:text-accent flex-1 truncate transition-colors"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    {t.name}
                  </h3>
                  <div className="flex gap-0.5 ml-2">
                    <button
                      onClick={() => setModal({ open: true, mode: 'rename', topic: t })}
                      className="p-2 text-muted hover:text-accent rounded-full hover:bg-raised transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setModal({ open: true, mode: 'delete', topic: t })}
                      className="p-2 text-muted hover:text-coral rounded-full hover:bg-raised transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <TopicBadge topic={enriched} />

                {enriched.dueCount > 0 && (
                  <div className="mt-4">
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
