import React, { useState } from 'react'
import { Plus, MessageSquare, Save, ClipboardList } from 'lucide-react'
import CardPreviewList from '../components/cards/CardPreviewList'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import { useToast } from '../components/ui/Toast'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'single', label: 'Single Card', icon: Plus },
  { id: 'bulk', label: 'Bulk Q&A', icon: ClipboardList },
]

const BULK_PLACEHOLDER = `Q: What is the time complexity of binary search?
A: O(log n)

Q: What data structure does BFS use?
A: A queue (FIFO)`

export default function Create() {
  const [activeTab, setActiveTab] = useState('single')
  const [previewCards, setPreviewCards] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [newTopicName, setNewTopicName] = useState('')
  const [saving, setSaving] = useState(false)

  // Single card state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  // Bulk state
  const [bulkText, setBulkText] = useState('')
  const [bulkError, setBulkError] = useState('')

  const { topics, createTopic, incrementCardCount } = useTopics()
  const { addCards } = useCards()
  const toast = useToast()
  const navigate = useNavigate()

  function addSingleCard(e) {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return
    setPreviewCards((cs) => [...cs, { question: question.trim(), answer: answer.trim(), _id: Date.now() }])
    setQuestion('')
    setAnswer('')
  }

  function parseBulk(e) {
    e.preventDefault()
    setBulkError('')
    const pairs = []
    const lines = bulkText.split('\n')
    let currentQ = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (/^Q:/i.test(trimmed)) {
        currentQ = trimmed.replace(/^Q:\s*/i, '')
      } else if (/^A:/i.test(trimmed) && currentQ) {
        pairs.push({ question: currentQ, answer: trimmed.replace(/^A:\s*/i, ''), _id: Date.now() + pairs.length })
        currentQ = null
      }
    }

    if (pairs.length === 0) {
      setBulkError('No Q:/A: pairs found. Format each pair as "Q: question" followed by "A: answer"')
      return
    }

    setPreviewCards((cs) => [...cs, ...pairs])
    setBulkText('')
  }

  function updateCard(index, field, value) {
    setPreviewCards((cs) => cs.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function deleteCard(index) {
    setPreviewCards((cs) => cs.filter((_, i) => i !== index))
  }

  async function saveCards() {
    if (!previewCards.length) return
    setSaving(true)
    try {
      let topicId = selectedTopicId

      if (!topicId && newTopicName.trim()) {
        topicId = createTopic(newTopicName.trim())
      }

      if (!topicId) {
        toast({ message: 'Please select or create a topic', type: 'error' })
        return
      }

      const cardsToSave = previewCards.map((c) => ({
        question: c.question,
        answer: c.answer,
        topicId,
      }))

      addCards(cardsToSave)
      incrementCardCount(topicId, cardsToSave.length)

      toast({ message: `${cardsToSave.length} cards saved!`, type: 'success' })
      setPreviewCards([])
      setSelectedTopicId('')
      setNewTopicName('')
      navigate('/topics')
    } catch (err) {
      toast({ message: err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Cards</h1>

      {/* Tabs + Input */}
      <div>
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 -mx-4 px-4 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'single' && (
          <form onSubmit={addSingleCard} className="space-y-4">
            <Input
              label="Question"
              textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question…"
              required
            />
            <Input
              label="Answer"
              textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer…"
              required
            />
            <Button type="submit" disabled={!question.trim() || !answer.trim()}>
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          </form>
        )}

        {activeTab === 'bulk' && (
          <form onSubmit={parseBulk} className="space-y-4">
            <Input
              label="Paste Q&A pairs (one Q: / A: pair per card)"
              textarea
              rows={10}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={BULK_PLACEHOLDER}
              required
              error={bulkError}
            />
            <Button type="submit" disabled={!bulkText.trim()}>
              <MessageSquare className="w-4 h-4" />
              Parse Cards
            </Button>
          </form>
        )}
      </div>

      {/* Preview */}
      {previewCards.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {previewCards.length} card{previewCards.length !== 1 ? 's' : ''} ready
            </h2>
            <button
              onClick={() => setPreviewCards([])}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>

          <CardPreviewList cards={previewCards} onChange={updateCard} onDelete={deleteCard} />

          {/* Topic selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Save to topic</p>
            <select
              value={selectedTopicId}
              onChange={(e) => { setSelectedTopicId(e.target.value); setNewTopicName('') }}
              className="block w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select existing topic…</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="text-xs text-center text-gray-400">— or —</p>
            <input
              value={newTopicName}
              onChange={(e) => { setNewTopicName(e.target.value); setSelectedTopicId('') }}
              placeholder="Create new topic…"
              className="block w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={saveCards}
            loading={saving}
            disabled={!previewCards.length || (!selectedTopicId && !newTopicName.trim())}
          >
            <Save className="w-4 h-4" />
            Save {previewCards.length} Cards
          </Button>
        </div>
      )}
    </div>
  )
}
