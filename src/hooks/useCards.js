import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { todayMidnight } from '../lib/sm2'

export function useCards(topicId = null) {
  const { user } = useAuth()
  const { data, loading, addCards: dataAddCards, updateCard: dataUpdateCard, deleteCard: dataDeleteCard } = useData()

  const cards = topicId
    ? data.cards.filter((c) => c.topicId === topicId)
    : data.cards

  function addCards(cardList) {
    if (!user || !cardList.length) return
    const today = todayMidnight()

    const newCards = cardList.map((card) => ({
      id: crypto.randomUUID(),
      topicId: card.topicId,
      question: card.question,
      answer: card.answer,
      repetitions: 0,
      interval: 0,
      nextReviewDate: today.toISOString(),
      createdAt: new Date().toISOString(),
    }))

    dataAddCards(newCards)
    return newCards.length
  }

  function updateCard(cardId, changes) {
    dataUpdateCard(cardId, changes)
  }

  function deleteCard(cardId) {
    dataDeleteCard(cardId)
  }

  function getDueCards() {
    const today = todayMidnight()
    return cards.filter((c) => {
      const d = new Date(c.nextReviewDate)
      return d <= today
    })
  }

  return { cards, loading, addCards, updateCard, deleteCard, getDueCards }
}
