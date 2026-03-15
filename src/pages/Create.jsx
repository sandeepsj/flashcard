import React, { useState } from 'react'
import { Link, MessageSquare, FileText, Save } from 'lucide-react'
import LinkInput from '../components/create/LinkInput'
import QAInput from '../components/create/QAInput'
import TheoryInput from '../components/create/TheoryInput'
import CardPreviewList from '../components/cards/CardPreviewList'
import Button from '../components/ui/Button'
import { useTopics } from '../hooks/useTopics'
import { useCards } from '../hooks/useCards'
import { useToast } from '../components/ui/Toast'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'link', label: 'LeetCode URL', icon: Link },
  { id: 'qa', label: 'Q & A', icon: MessageSquare },
  { id: 'theory', label: 'Theory', icon: FileText },
]

export default function Create() {
  const [activeTab, setActiveTab] = useState('link')
  const [previewCards, setPreviewCards] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [newTopicName, setNewTopicName] = useState('')
  const [saving, setSaving] = useState(false)

  const { topics, createTopic, incrementCardCount } = useTopics()
  const { addCards } = useCards()
  const toast = useToast()
  const navigate = useNavigate()

  function handleCards(cards) {
    setPreviewCards(cards.map((c, i) => ({ ...c, _id: Date.now() + i })))
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        topicId = await createTopic(newTopicName.trim())
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

      await addCards(cardsToSave)
      await incrementCardCount(topicId, cardsToSave.length)

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

      {/* Tabs */}
      {previewCards.length === 0 && (
        <div>
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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

          {activeTab === 'link' && <LinkInput onCards={handleCards} />}
          {activeTab === 'qa' && <QAInput onCards={handleCards} />}
          {activeTab === 'theory' && <TheoryInput onCards={handleCards} />}
        </div>
      )}

      {/* Preview */}
      {previewCards.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {previewCards.length} card{previewCards.length !== 1 ? 's' : ''} generated
            </h2>
            <button
              onClick={() => setPreviewCards([])}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ← Back
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
