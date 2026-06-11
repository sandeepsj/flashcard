import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function FlashCard({ card, isFlipped, onFlip, onSpeak, onStopSpeak, speaking, speechSupported }) {
  return (
    <div
      className="card-scene w-full"
      style={{ height: 'clamp(280px, 44vh, 420px)' }}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front — question */}
        <div
          className="card-face flex flex-col items-center justify-center p-8 cursor-pointer select-none shadow-card border border-line"
          style={{ background: 'var(--card-front-bg)' }}
          onClick={!isFlipped ? onFlip : undefined}
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-accent mb-5">
            Question
          </span>
          <p className="font-display text-center text-xl md:text-2xl font-semibold text-text leading-snug">
            {card?.question}
          </p>
          {speechSupported && (
            <button
              onClick={(e) => { e.stopPropagation(); speaking ? onStopSpeak() : onSpeak(card?.question) }}
              className="absolute bottom-4 right-4 p-2.5 rounded-full border border-line text-muted hover:text-accent hover:border-accent/50 transition-colors"
              title={speaking ? 'Stop' : 'Read aloud'}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
          {!isFlipped && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60">
              Tap to flip
            </p>
          )}
        </div>

        {/* Back — answer */}
        <div
          className="card-face card-face-back flex flex-col items-center justify-center p-8 shadow-card border border-accent/30"
          style={{ background: 'var(--card-back-bg)' }}
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-accent mb-5">
            Answer
          </span>
          <p className="text-center text-base md:text-lg text-text leading-relaxed overflow-y-auto max-h-64 no-scrollbar">
            {card?.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
