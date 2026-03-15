import React, { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { FUNCTIONS_BASE_URL } from '../../lib/firebase'

const PLACEHOLDER = `A hash table stores key-value pairs and provides O(1) average-case lookup. It uses a hash function to map keys to buckets (array indices). Collision resolution strategies include chaining (linked list per bucket) and open addressing (linear probing). Load factor is the ratio of entries to buckets; most implementations resize when it exceeds 0.75.`

export default function TheoryInput({ onCards }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_BASE_URL}/generateFromTheory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.cards?.length) {
        onCards(data.cards)
      } else {
        throw new Error('No cards generated — try a longer passage')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <Input
        label="Paste a theory paragraph (Claude will generate 3–6 cards)"
        textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        required
        error={error}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Aim for ~200 words per paragraph for best results.
      </p>
      <Button type="submit" loading={loading} disabled={!text.trim()}>
        Generate Cards
      </Button>
    </form>
  )
}
