import React, { useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, Coffee } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center gap-4 text-center rounded-3xl border border-dashed border-accent/40 bg-accent/5 p-10 animate-rise">
        <Coffee className="w-8 h-8 text-accent" />
        <div>
          <p className="font-display text-xl font-bold mb-1">All clear</p>
          <p className="text-sm text-muted">No cards due for review today</p>
        </div>
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
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        {topicName && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] border border-line bg-surface text-muted px-3 py-1.5 rounded-full">
            {topicName}
          </span>
        )}
        <span className="ml-auto font-mono text-sm text-muted">
          <span className="text-accent font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span>
          {' / '}
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-raised rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
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
        <div className="flex gap-3 animate-fade-in">
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={() => grade('missed')}
          >
            <XCircle className="w-5 h-5" />
            Missed
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
        <Button size="xl" fullWidth onClick={flip}>
          Reveal Answer
        </Button>
      )}
    </div>
  )
}
