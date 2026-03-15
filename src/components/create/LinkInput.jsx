import React, { useState } from 'react'
import { Link } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { FUNCTIONS_BASE_URL } from '../../lib/firebase'

export default function LinkInput({ onCards }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFetch(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_BASE_URL}/fetchLeetCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.cards?.length) {
        onCards(data.cards)
      } else {
        throw new Error('No cards generated — check the URL')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleFetch} className="space-y-4">
      <Input
        label="LeetCode problem URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://leetcode.com/problems/two-sum/"
        required
        error={error}
      />
      {error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          If the URL doesn't work, use the Q&A tab to paste the content manually.
        </p>
      )}
      <Button type="submit" loading={loading} disabled={!url.trim()}>
        <Link className="w-4 h-4" />
        Generate Cards
      </Button>
    </form>
  )
}
