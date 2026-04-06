import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import StudySession from '../components/study/StudySession'

export default function Study() {
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topic') || null
  const { data } = useData()
  const speechSettings = {
    rate: data.settings.speechRate || 1.0,
    voiceURI: data.settings.voiceURI || null,
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Study Session</h1>
      <StudySession topicId={topicId} speechSettings={speechSettings} />
    </div>
  )
}
