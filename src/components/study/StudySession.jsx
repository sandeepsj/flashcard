import React, { useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import FlashCard from '../cards/FlashCard'
import CompletionScreen from './CompletionScreen'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { useStudySession } from '../../hooks/useStudySession'
import { useSpeech } from '../../hooks/useSpeech'
import { useTopics } from '../../hooks/useTopics'

export default function StudySession({ topicId = null, speechSettings = {} }) {
  const {
    queue, currentCard, currentIndex, total,
    isFlipped, sessionStats, loading, done, elapsedSeconds,
    flip, grade, restart,
  } = useStudySession(topicId)

  const { supported, speaking, speak, cancel } = useSpeech(speechSettings)
  const { topics } = useTopics()

  // Auto-speak question when card changes
  useEffect(() => {
    if (currentCard && !isFlipped && supported) {
      speak(currentCard.question)
    }
    return () => cancel()
  }, [currentCard?.id, isFlipped])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  if (done && total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center p-6">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No cards due for review today!</p>
        <Button variant="secondary" onClick={restart}>
          <RotateCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <CompletionScreen
        stats={sessionStats}
        elapsedSeconds={elapsedSeconds}
        onRestart={restart}
      />
    )
  }

  const topicName = topics.find((t) => t.id === currentCard?.topicId)?.name

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        {topicName && (
          <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">
            {topicName}
          </span>
        )}
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-medium">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <FlashCard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={flip}
        onSpeak={() => speak(isFlipped ? currentCard?.answer : currentCard?.question)}
        onStopSpeak={cancel}
        speaking={speaking}
        speechSupported={supported}
      />

      {/* Grade buttons — only after flip */}
      {isFlipped && (
        <div className="flex gap-4 animate-fade-in">
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={() => grade('missed')}
          >
            <XCircle className="w-5 h-5" />
            Missed It
          </Button>
          <Button
            variant="success"
            size="xl"
            fullWidth
            onClick={() => grade('got')}
          >
            <CheckCircle className="w-5 h-5" />
            Got It
          </Button>
        </div>
      )}

      {!isFlipped && (
        <Button size="lg" fullWidth onClick={flip}>
          Reveal Answer
        </Button>
      )}
    </div>
  )
}
