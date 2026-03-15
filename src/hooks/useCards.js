import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { todayMidnight } from '../lib/sm2'

export function useCards(topicId = null) {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setCards([]); setLoading(false); return }

    const constraints = [where('uid', '==', user.uid)]
    if (topicId) constraints.push(where('topicId', '==', topicId))

    const q = query(collection(db, 'cards'), ...constraints)
    const unsub = onSnapshot(q, (snap) => {
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user, topicId])

  async function addCards(cardList) {
    if (!user || !cardList.length) return
    const batch = writeBatch(db)
    const today = todayMidnight()

    cardList.forEach((card) => {
      const ref = doc(collection(db, 'cards'))
      batch.set(ref, {
        uid: user.uid,
        topicId: card.topicId,
        question: card.question,
        answer: card.answer,
        repetitions: 0,
        interval: 0,
        nextReviewDate: today,
        createdAt: serverTimestamp(),
      })
    })
    await batch.commit()
    return cardList.length
  }

  async function updateCard(cardId, data) {
    await updateDoc(doc(db, 'cards', cardId), data)
  }

  async function deleteCard(cardId) {
    await deleteDoc(doc(db, 'cards', cardId))
  }

  /** Cards due for review today or earlier */
  function getDueCards() {
    const today = todayMidnight()
    return cards.filter((c) => {
      const d = c.nextReviewDate?.toDate ? c.nextReviewDate.toDate() : new Date(c.nextReviewDate)
      return d <= today
    })
  }

  return { cards, loading, addCards, updateCard, deleteCard, getDueCards }
}
