import React, { useEffect, useState } from 'react'
import {
  collection, query, where, getDocs, doc, getDoc, Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import { todayMidnight } from '../lib/sm2'
import MetricsRow from '../components/dashboard/MetricsRow'
import Heatmap from '../components/dashboard/Heatmap'
import ScoreChart from '../components/dashboard/ScoreChart'
import TopicProgressList from '../components/dashboard/TopicProgressList'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { topics } = useTopics()
  const { cards } = useCards()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([])
  const [userSettings, setUserSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    try {
      // Load reviews (last 365 days)
      const since = new Date()
      since.setFullYear(since.getFullYear() - 1)
      const revSnap = await getDocs(query(
        collection(db, 'reviews'),
        where('uid', '==', user.uid),
        where('reviewedAt', '>=', Timestamp.fromDate(since))
      ))
      setReviews(revSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

      // Load user settings (streak etc)
      const settingsSnap = await getDoc(doc(db, 'users', user.uid, 'settings', 'app'))
      if (settingsSnap.exists()) setUserSettings(settingsSnap.data())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Compute metrics
  const today = todayMidnight()
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

  const dueToday = cards.filter((c) => {
    const d = c.nextReviewDate?.toDate ? c.nextReviewDate.toDate() : new Date(c.nextReviewDate || 0)
    return d <= tomorrow
  }).length

  const todayKey = today.toISOString().slice(0, 10)
  const studiedToday = reviews.filter((r) => {
    const d = r.reviewedAt?.toDate ? r.reviewedAt.toDate() : new Date(r.reviewedAt)
    return d.toISOString().slice(0, 10) === todayKey
  }).length

  const streak = userSettings.streakCount || 0
  const totalCards = cards.length

  const last30Reviews = reviews.filter((r) => {
    const d = r.reviewedAt?.toDate ? r.reviewedAt.toDate() : new Date(r.reviewedAt)
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
    return d >= cutoff
  })

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Good {getGreeting()}, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {dueToday > 0 && (
          <Button onClick={() => navigate('/study')}>
            <BookOpen className="w-4 h-4" />
            Study {dueToday} cards
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Activity (last year)</h2>
        <Heatmap reviews={reviews} />
      </div>

      {/* Score chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Got It vs Missed (last 30 days)</h2>
        <ScoreChart reviews={last30Reviews} />
      </div>

      {/* Topic progress */}
      {topics.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Topics</h2>
          <TopicProgressList topics={topics} cards={cards} />
        </div>
      )}

      {totalCards === 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-8 text-center">
          <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-3">No cards yet</p>
          <p className="text-sm text-indigo-500 dark:text-indigo-400 mb-4">Create your first flashcard to get started</p>
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
