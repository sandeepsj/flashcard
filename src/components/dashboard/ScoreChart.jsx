import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function ScoreChart({ reviews = [] }) {
  const data = useMemo(() => {
    const map = {}
    const today = new Date()
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      map[key] = { date: key, got: 0, missed: 0 }
    }
    reviews.forEach((r) => {
      const date = r.reviewedAt?.toDate ? r.reviewedAt.toDate() : new Date(r.reviewedAt)
      const key = date.toISOString().slice(0, 10)
      if (map[key]) {
        if (r.result === 'got') map[key].got++
        else map[key].missed++
      }
    })
    return Object.values(map).map((d) => ({
      ...d,
      label: d.date.slice(5), // MM-DD
    }))
  }, [reviews])

  // Show every 5th label to avoid clutter
  const tickFormatter = (val, idx) => idx % 5 === 0 ? val : ''

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity, 0.1)" className="opacity-20" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #1e1b4b)',
            border: 'none',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="got" name="Got It" fill="#10b981" radius={[3,3,0,0]} />
        <Bar dataKey="missed" name="Missed" fill="#f43f5e" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
