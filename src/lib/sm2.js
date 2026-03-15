/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Got It (result = 'got') → advance through intervals [1,3,7,14,30], then ×2
 * Missed It (result = 'missed') → reset interval to 1 day, reset repetitions
 */

const INTERVALS = [1, 3, 7, 14, 30]

/**
 * @param {object} card - existing card data
 * @param {number} card.repetitions - how many consecutive "got it" in a row
 * @param {number} card.interval - current interval in days
 * @param {'got'|'missed'} result
 * @returns {{ repetitions, interval, nextReviewDate: Date }}
 */
export function calculateNextReview(card, result) {
  const now = new Date()

  if (result === 'missed') {
    const nextReviewDate = new Date(now)
    nextReviewDate.setDate(nextReviewDate.getDate() + 1)
    return {
      repetitions: 0,
      interval: 1,
      nextReviewDate,
    }
  }

  // Got it
  const rep = (card.repetitions ?? 0) + 1
  let interval

  if (rep <= INTERVALS.length) {
    interval = INTERVALS[rep - 1]
  } else {
    // Beyond the preset ladder: double previous interval
    interval = Math.round((card.interval ?? 1) * 2)
  }

  const nextReviewDate = new Date(now)
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return { repetitions: rep, interval, nextReviewDate }
}

/** Returns true if the card is "mastered" (interval >= 30 days) */
export function isMastered(card) {
  return (card.interval ?? 0) >= 30
}

/** Returns today's date at midnight (local) as a Date */
export function todayMidnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
