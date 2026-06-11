import React from 'react'
import { Trash2 } from 'lucide-react'
import Input from '../ui/Input'

export default function CardPreviewList({ cards, onChange, onDelete }) {
  return (
    <div className="space-y-4">
      {cards.map((card, i) => (
        <div
          key={card._id || i}
          className="rounded-3xl border border-line bg-surface p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Card {String(i + 1).padStart(2, '0')}
            </span>
            <button
              onClick={() => onDelete(i)}
              className="p-2 text-muted hover:text-coral rounded-full hover:bg-raised transition-colors"
              title="Remove card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Input
            label="Question"
            textarea
            rows={2}
            value={card.question}
            onChange={(e) => onChange(i, 'question', e.target.value)}
            placeholder="Question…"
          />
          <Input
            label="Answer"
            textarea
            rows={3}
            value={card.answer}
            onChange={(e) => onChange(i, 'answer', e.target.value)}
            placeholder="Answer…"
          />
        </div>
      ))}
    </div>
  )
}
