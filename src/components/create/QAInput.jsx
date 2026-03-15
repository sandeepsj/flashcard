import React, { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { FUNCTIONS_BASE_URL } from '../../lib/firebase'

const PLACEHOLDER = `Q: What is the time complexity of binary search?
A: O(log n)

Q: What data structure does BFS use?
A: A queue (FIFO)`

export default function QAInput({ onCards }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_BASE_URL}/generateFromQA`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.cards?.length) {
        onCards(data.cards)
      } else {
        throw new Error('No cards extracted — check your Q&A format')
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
        label="Paste Q&A pairs (one Q: / A: pair per card)"
        textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        required
        error={error}
      />
      <Button type="submit" loading={loading} disabled={!text.trim()}>
        Extract Cards
      </Button>
    </form>
  )
}
