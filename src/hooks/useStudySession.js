import { useState, useEffect, useCallback, useRef } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { calculateNextReview, todayMidnight } from '../lib/sm2'

export function useStudySession(topicId = null) {
  const { user } = useAuth()
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
  }, [user, topicId])

  async function loadQueue() {
    setLoading(true)
    const today = Timestamp.fromDate(todayMidnight())
    const tomorrow = new Date(todayMidnight())
    tomorrow.setDate(tomorrow.getDate() + 1)

    const constraints = [
      where('uid', '==', user.uid),
      where('nextReviewDate', '<=', Timestamp.fromDate(tomorrow)),
    ]
    if (topicId) constraints.push(where('topicId', '==', topicId))

    const snap = await getDocs(query(collection(db, 'cards'), ...constraints))
    const cards = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    setQueue(cards)
    setCurrentIndex(0)
    setIsFlipped(false)
    setDone(cards.length === 0)
    setLoading(false)
    startTimeRef.current = Date.now()
  }

  const currentCard = queue[currentIndex] ?? null

  function flip() {
    setIsFlipped(true)
  }

  async function grade(result) {
    if (!currentCard) return

    const update = calculateNextReview(currentCard, result)

    // Update card in Firestore
    await updateDoc(doc(db, 'cards', currentCard.id), {
      repetitions: update.repetitions,
      interval: update.interval,
      nextReviewDate: Timestamp.fromDate(update.nextReviewDate),
      lastReviewedAt: serverTimestamp(),
    })

    // Write review record
    await addDoc(collection(db, 'reviews'), {
      uid: user.uid,
      cardId: currentCard.id,
      topicId: currentCard.topicId,
      result,
      reviewedAt: serverTimestamp(),
    })

    // Update stats + advance
    setSessionStats((s) => ({ ...s, [result === 'got' ? 'got' : 'missed']: s[result === 'got' ? 'got' : 'missed'] + 1 }))

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
