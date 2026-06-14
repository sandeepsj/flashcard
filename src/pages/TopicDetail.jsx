import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Eye, EyeOff, Plus, Layers } from 'lucide-react'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import Button from '../components/ui/Button'

export default function TopicDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { topics, loading } = useTopics()
  const { cards } = useCards(id)

  const [revealAll, setRevealAll] = useState(true)
  const [revealed, setRevealed] = useState({})

  const topic = topics.find((t) => t.id === id)

  // Wait for data before deciding the topic is missing
  if (!topic) {
    if (loading) return null
    return <Navigate to="/topics" replace />
  }

  function toggleCard(cardId) {
    setRevealed((r) => ({ ...r, [cardId]: !r[cardId] }))
  }

  function isAnswerVisible(cardId) {
    // Per-card override flips whatever the global state is
    return revealed[cardId] ? !revealAll : revealAll
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/topics')}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors animate-rise"
      >
        <ArrowLeft className="w-4 h-4" />
        Topics
      </button>

      <div className="flex items-end justify-between gap-4 animate-rise" style={{ animationDelay: '60ms' }}>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight truncate">
            {topic.name}<span className="text-accent">.</span>
          </h1>
        </div>
        {cards.length > 0 && (
          <Button onClick={() => setRevealAll((v) => !v)} variant="ghost" size="sm">
            {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {revealAll ? 'Hide answers' : 'Show answers'}
          </Button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-accent/40 bg-accent/5 p-10 text-center animate-rise" style={{ animationDelay: '120ms' }}>
          <Layers className="w-8 h-8 text-accent mx-auto mb-4" />
          <p className="font-display text-xl font-bold mb-2">No cards yet</p>
          <p className="text-sm text-muted mb-6">Add some questions to this topic to review them here</p>
          <Button onClick={() => navigate('/create')}>
            <Plus className="w-4 h-4" />
            Add Cards
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cards.map((card, i) => {
              const showAnswer = isAnswerVisible(card.id)
              return (
                <div
                  key={card.id}
                  className="rounded-3xl border border-line bg-surface p-5 animate-rise"
                  style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mt-1 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1 space-y-3">
                      <p className="font-display text-base font-semibold text-text leading-snug">
                        {card.question}
                      </p>
                      {showAnswer ? (
                        <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap rounded-2xl bg-raised/60 px-4 py-3">
                          {card.answer}
                        </p>
                      ) : (
                        <button
                          onClick={() => toggleCard(card.id)}
                          className="text-xs font-medium text-muted hover:text-accent transition-colors"
                        >
                          Reveal answer
                        </button>
                      )}
                      {showAnswer && (
                        <button
                          onClick={() => toggleCard(card.id)}
                          className="text-xs font-medium text-muted hover:text-accent transition-colors"
                        >
                          Hide answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-2">
            <Button fullWidth onClick={() => navigate(`/study?topic=${topic.id}`)}>
              <BookOpen className="w-4 h-4" />
              Study this topic
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
