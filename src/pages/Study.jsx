import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import StudySession from '../components/study/StudySession'

export default function Study() {
  const { user } = useAuth()
  const [speechSettings, setSpeechSettings] = useState({ rate: 1.0, voiceURI: null })

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid, 'settings', 'app'))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data()
          setSpeechSettings({ rate: d.speechRate || 1.0, voiceURI: d.voiceURI || null })
        }
      })
      .catch(() => {})
  }, [user])

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Study Session</h1>
      <StudySession speechSettings={speechSettings} />
    </div>
  )
}
