import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { calculateNextReview, todayMidnight } from '../lib/sm2'

export function useStudySession(topicId = null) {
  const { user } = useAuth()
  const { data, updateCard, addReview } = useData()
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ got: 0, missed: 0 })
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!user) return
    loadQueue()
  }, [user, topicId, data.cards])

  function loadQueue() {
    setLoading(true)
    const today = todayMidnight()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let cards = data.cards
    if (topicId) cards = cards.filter((c) => c.topicId === topicId)

    const due = cards.filter((c) => {
      const d = new Date(c.nextReviewDate)
      return d <= tomorrow
    })

    setQueue(due)
    setCurrentIndex(0)
    setIsFlipped(false)
    setDone(due.length === 0)
    setLoading(false)
    startTimeRef.current = Date.now()
  }

  const currentCard = queue[currentIndex] ?? null

  function flip() {
    setIsFlipped(true)
  }

  function grade(result) {
    if (!currentCard) return

    const update = calculateNextReview(currentCard, result)

    updateCard(currentCard.id, {
      repetitions: update.repetitions,
      interval: update.interval,
      nextReviewDate: update.nextReviewDate.toISOString(),
      lastReviewedAt: new Date().toISOString(),
    })

    addReview({
      id: crypto.randomUUID(),
      cardId: currentCard.id,
      topicId: currentCard.topicId,
      result,
      reviewedAt: new Date().toISOString(),
    })

    setSessionStats((s) => ({
      ...s,
      [result === 'got' ? 'got' : 'missed']: s[result === 'got' ? 'got' : 'missed'] + 1,
    }))

    const next = currentIndex + 1
    if (next >= queue.length) {
      setDone(true)
    } else {
      setCurrentIndex(next)
      setIsFlipped(false)
    }
  }

  const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)

  return {
    queue,
    currentCard,
    currentIndex,
    total: queue.length,
    isFlipped,
    sessionStats,
    loading,
    done,
    elapsedSeconds,
    flip,
    grade,
    restart: loadQueue,
  }
}
