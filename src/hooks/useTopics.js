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
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

export function useTopics() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setTopics([]); setLoading(false); return }

    const q = query(collection(db, 'topics'), where('uid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setTopics(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user])

  async function createTopic(name) {
    if (!user) return
    const trimmed = name.trim()
    if (topics.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Topic "${trimmed}" already exists`)
    }
    const ref = await addDoc(collection(db, 'topics'), {
      uid: user.uid,
      name: trimmed,
      cardCount: 0,
      createdAt: serverTimestamp(),
    })
    return ref.id
  }

  async function renameTopic(topicId, newName) {
    const trimmed = newName.trim()
    if (topics.some((t) => t.id !== topicId && t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Topic "${trimmed}" already exists`)
    }
    await updateDoc(doc(db, 'topics', topicId), { name: trimmed })
  }

  async function deleteTopic(topicId, reassignToId = null) {
    const batch = writeBatch(db)
    const cardsQ = query(collection(db, 'cards'), where('topicId', '==', topicId), where('uid', '==', user.uid))
    const cardsSnap = await getDocs(cardsQ)

    if (reassignToId) {
      cardsSnap.docs.forEach((d) => batch.update(d.ref, { topicId: reassignToId }))
      batch.update(doc(db, 'topics', reassignToId), { cardCount: topics.find(t => t.id === reassignToId)?.cardCount + cardsSnap.size || cardsSnap.size })
    } else {
      cardsSnap.docs.forEach((d) => batch.delete(d.ref))
    }

    batch.delete(doc(db, 'topics', topicId))
    await batch.commit()
  }

  async function incrementCardCount(topicId, delta = 1) {
    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return
    await updateDoc(doc(db, 'topics', topicId), {
      cardCount: Math.max(0, (topic.cardCount || 0) + delta),
    })
  }

  return { topics, loading, createTopic, renameTopic, deleteTopic, incrementCardCount }
}
