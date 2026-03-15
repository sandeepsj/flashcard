import React from 'react'
import { Trash2 } from 'lucide-react'
import Input from '../ui/Input'

export default function CardPreviewList({ cards, onChange, onDelete }) {
  return (
    <div className="space-y-4">
      {cards.map((card, i) => (
        <div
          key={card._id || i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Card {i + 1}</span>
            <button
              onClick={() => onDelete(i)}
              className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
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
