import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useTopics } from '../../hooks/useTopics'
import { useToast } from '../ui/Toast'

/** mode: 'create' | 'rename' | 'delete' */
export default function TopicModal({ mode, topic, open, onClose }) {
  const { topics, createTopic, renameTopic, deleteTopic } = useTopics()
  const toast = useToast()
  const [name, setName] = useState('')
  const [reassignId, setReassignId] = useState('')
  const [deleteAction, setDeleteAction] = useState('delete') // 'delete' | 'reassign'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName(mode === 'rename' ? topic?.name || '' : '')
      setError('')
      setReassignId('')
      setDeleteAction('delete')
    }
  }, [open, mode, topic])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'create') {
        await createTopic(name)
        toast({ message: `Topic "${name.trim()}" created`, type: 'success' })
      } else if (mode === 'rename') {
        await renameTopic(topic.id, name)
        toast({ message: 'Topic renamed', type: 'success' })
      } else if (mode === 'delete') {
        await deleteTopic(topic.id, deleteAction === 'reassign' ? reassignId : null)
        toast({ message: 'Topic deleted', type: 'success' })
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const otherTopics = topics.filter((t) => t.id !== topic?.id)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Topic' : mode === 'rename' ? 'Rename Topic' : 'Delete Topic'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {(mode === 'create' || mode === 'rename') && (
          <Input
            label="Topic name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arrays & Hashing"
            autoFocus
            required
            error={error}
          />
        )}

        {mode === 'delete' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{topic?.name}</span>
              {' '}has{' '}
              <span className="font-semibold">{topic?.cardCount || 0} cards</span>.
              What should happen to them?
            </p>

            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  value="delete"
                  checked={deleteAction === 'delete'}
                  onChange={() => setDeleteAction('delete')}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Delete all cards</p>
                  <p className="text-xs text-gray-500">This cannot be undone</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  value="reassign"
                  checked={deleteAction === 'reassign'}
                  onChange={() => setDeleteAction('reassign')}
                  disabled={otherTopics.length === 0}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${otherTopics.length === 0 ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    Move cards to another topic
                  </p>
                  {deleteAction === 'reassign' && otherTopics.length > 0 && (
                    <select
                      value={reassignId}
                      onChange={(e) => setReassignId(e.target.value)}
                      required={deleteAction === 'reassign'}
                      className="mt-1 block w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select topic…</option>
                      {otherTopics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </label>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant={mode === 'delete' ? 'danger' : 'primary'}
            loading={loading}
            disabled={mode === 'delete' && deleteAction === 'reassign' && !reassignId}
          >
            {mode === 'create' ? 'Create' : mode === 'rename' ? 'Save' : 'Delete'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
