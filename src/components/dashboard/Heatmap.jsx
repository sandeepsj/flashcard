import React, { useMemo, useState } from 'react'

function getColor(count) {
  if (count === 0) return 'var(--heatmap-0)'
  if (count <= 5) return 'var(--heatmap-1)'
  if (count <= 15) return 'var(--heatmap-2)'
  return 'var(--heatmap-3)'
}

function buildGrid(reviewsByDate, weeks) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cells = []

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + d))
      const key = date.toISOString().slice(0, 10)
      cells.push({ date, key, count: reviewsByDate[key] || 0 })
    }
  }

  // Build as column-major (week columns, day rows)
  const grid = []
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      col.push(cells[w * 7 + d])
    }
    grid.push(col)
  }
  return grid
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS = ['S','M','T','W','T','F','S']

export default function Heatmap({ reviews = [] }) {
  const [tooltip, setTooltip] = useState(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480

  const weeks = isMobile ? 16 : 52

  const reviewsByDate = useMemo(() => {
    const map = {}
    reviews.forEach((r) => {
      const date = r.reviewedAt?.toDate ? r.reviewedAt.toDate() : new Date(r.reviewedAt)
      const key = date.toISOString().slice(0, 10)
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [reviews])

  const grid = useMemo(() => buildGrid(reviewsByDate, weeks), [reviewsByDate, weeks])

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels = []
    let lastMonth = -1
    grid.forEach((col, wi) => {
      const month = col[0]?.date?.getMonth()
      if (month !== lastMonth) {
        labels.push({ wi, label: MONTH_LABELS[month] })
        lastMonth = month
      }
    })
    return labels
  }, [grid])

  const cellSize = isMobile ? 12 : 14
  const gap = 2

  return (
    <div className="relative overflow-x-auto no-scrollbar">
      <div className="flex gap-1 items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1 mt-5">
          {DAY_LABELS.map((d, i) => (
            <div key={i} style={{ height: cellSize, width: 10 }} className="flex items-center justify-center text-[9px] text-gray-400 dark:text-gray-600">
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>

        <div>
          {/* Month labels */}
          <div className="flex gap-[2px] mb-1 h-4">
            {grid.map((_, wi) => {
              const ml = monthLabels.find((m) => m.wi === wi)
              return (
                <div key={wi} style={{ width: cellSize }} className="text-[9px] text-gray-400 dark:text-gray-600 whitespace-nowrap">
                  {ml ? ml.label : ''}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {grid.map((col, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {col.map((cell, di) => cell ? (
                  <div
                    key={di}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell.count),
                      borderRadius: 2,
                    }}
                    onMouseEnter={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ) : <div key={di} style={{ width: cellSize, height: cellSize }} />)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg"
          style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
        >
          {tooltip.cell.key}: {tooltip.cell.count} review{tooltip.cell.count !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
