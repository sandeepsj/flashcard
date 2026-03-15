import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function FlashCard({ card, isFlipped, onFlip, onSpeak, onStopSpeak, speaking, speechSupported }) {
  return (
    <div
      className="card-scene w-full"
      style={{ height: 'clamp(260px, 40vh, 400px)' }}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front — question */}
        <div
          className="card-face flex flex-col items-center justify-center p-8 cursor-pointer select-none shadow-xl border border-gray-200 dark:border-gray-700"
          style={{ background: 'var(--card-front-bg)' }}
          onClick={!isFlipped ? onFlip : undefined}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-4">
            Question
          </span>
          <p className="text-center text-lg md:text-xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
            {card?.question}
          </p>
          {speechSupported && (
            <button
              onClick={(e) => { e.stopPropagation(); speaking ? onStopSpeak() : onSpeak(card?.question) }}
              className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-indigo-500 transition-colors"
              title={speaking ? 'Stop' : 'Read aloud'}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
          {!isFlipped && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-600">
              Tap to reveal answer
            </p>
          )}
        </div>

        {/* Back — answer */}
        <div
          className="card-face card-face-back flex flex-col items-center justify-center p-8 shadow-xl border border-indigo-200 dark:border-indigo-800"
          style={{ background: 'var(--card-back-bg)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-4">
            Answer
          </span>
          <p className="text-center text-base md:text-lg text-gray-800 dark:text-gray-100 leading-relaxed overflow-y-auto max-h-64 no-scrollbar">
            {card?.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
