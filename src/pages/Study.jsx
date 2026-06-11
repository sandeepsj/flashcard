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
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <div className="pt-2 mb-4 animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5">Focus mode</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Study<span className="text-accent">.</span>
        </h1>
      </div>
      <StudySession topicId={topicId} speechSettings={speechSettings} />
    </div>
  )
}
