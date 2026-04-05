import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function useTopics() {
  const { user } = useAuth()
  const {
    data,
    loading,
    addTopic: dataAddTopic,
    updateTopic: dataUpdateTopic,
    deleteTopic: dataDeleteTopic,
    updateCard,
    deleteCard,
  } = useData()

  const topics = data.topics

  function createTopic(name) {
    if (!user) return
    const trimmed = name.trim()
    if (topics.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Topic "${trimmed}" already exists`)
    }
    const id = crypto.randomUUID()
    dataAddTopic({
      id,
      name: trimmed,
      cardCount: 0,
      createdAt: new Date().toISOString(),
    })
    return id
  }

  function renameTopic(topicId, newName) {
    const trimmed = newName.trim()
    if (topics.some((t) => t.id !== topicId && t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Topic "${trimmed}" already exists`)
    }
    dataUpdateTopic(topicId, { name: trimmed })
  }

  function deleteTopic(topicId, reassignToId = null) {
    const topicCards = data.cards.filter((c) => c.topicId === topicId)

    if (reassignToId) {
      topicCards.forEach((c) => updateCard(c.id, { topicId: reassignToId }))
      const target = topics.find((t) => t.id === reassignToId)
      if (target) {
        dataUpdateTopic(reassignToId, { cardCount: (target.cardCount || 0) + topicCards.length })
      }
    } else {
      topicCards.forEach((c) => deleteCard(c.id))
    }

    dataDeleteTopic(topicId)
  }

  function incrementCardCount(topicId, delta = 1) {
    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return
    dataUpdateTopic(topicId, { cardCount: Math.max(0, (topic.cardCount || 0) + delta) })
  }

  return { topics, loading, createTopic, renameTopic, deleteTopic, incrementCardCount }
}
