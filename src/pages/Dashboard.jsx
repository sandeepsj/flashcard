import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import { todayMidnight } from '../lib/sm2'
import MetricsRow from '../components/dashboard/MetricsRow'
import Heatmap from '../components/dashboard/Heatmap'
import ScoreChart from '../components/dashboard/ScoreChart'
import TopicProgressList from '../components/dashboard/TopicProgressList'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading } = useData()
  const { topics } = useTopics()
  const { cards } = useCards()
  const navigate = useNavigate()

  const reviews = data.reviews

  // Compute metrics
  const today = todayMidnight()
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

  const dueToday = cards.filter((c) => {
    const d = new Date(c.nextReviewDate)
    return d <= tomorrow
  }).length

  const todayKey = today.toISOString().slice(0, 10)
  const studiedToday = reviews.filter((r) => {
    const d = new Date(r.reviewedAt)
    return d.toISOString().slice(0, 10) === todayKey
  }).length

  const streak = data.settings.streakCount || 0
  const totalCards = cards.length

  const last30Reviews = reviews.filter((r) => {
    const d = new Date(r.reviewedAt)
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
    return d >= cutoff
  })

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-5">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 animate-rise">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
            Good {getGreeting()}, {user?.displayName?.split(' ')[0]}
            <span className="text-accent">.</span>
          </h1>
        </div>
        {dueToday > 0 && (
          <Button size="lg" onClick={() => navigate('/study')}>
            <BookOpen className="w-4 h-4" />
            Study {dueToday} due
          </Button>
        )}
      </div>

      <MetricsRow
        dueToday={dueToday}
        studiedToday={studiedToday}
        streak={streak}
        totalCards={totalCards}
        loading={loading}
      />

      {/* Heatmap */}
      <div className="rounded-3xl border border-line bg-surface p-5 animate-rise" style={{ animationDelay: '150ms' }}>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-4">
          Activity — last year
        </h2>
        <Heatmap reviews={reviews} />
      </div>

      {/* Score chart */}
      <div className="rounded-3xl border border-line bg-surface p-5 animate-rise" style={{ animationDelay: '220ms' }}>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-4">
          Got it vs missed — 30 days
        </h2>
        <ScoreChart reviews={last30Reviews} />
      </div>

      {/* Topic progress */}
      {topics.length > 0 && (
        <div className="animate-rise" style={{ animationDelay: '290ms' }}>
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-3 px-1">
            Topics
          </h2>
          <TopicProgressList topics={topics} cards={cards} />
        </div>
      )}

      {totalCards === 0 && (
        <div className="rounded-3xl border border-dashed border-accent/40 bg-accent/5 p-10 text-center animate-rise" style={{ animationDelay: '150ms' }}>
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
          <p className="font-display text-xl font-bold mb-2">Your deck is empty</p>
          <p className="text-sm text-muted mb-6">Create your first flashcard to start the streak</p>
          <Button onClick={() => navigate('/create')}>Create Cards</Button>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
