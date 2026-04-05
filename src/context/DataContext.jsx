import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { findOrCreateFolder, findFile, readJsonFile, writeJsonFile } from '../lib/drive'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

const FOLDER_NAME = 'Flashcards'
const FILE_NAME = 'flashcards-data.json'
const DEBOUNCE_MS = 800

const EMPTY_DATA = { cards: [], topics: [], reviews: [], settings: {} }

export function DataProvider({ children }) {
  const { accessToken } = useAuth()
  const [data, setData] = useState(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const folderIdRef = useRef(null)
  const fileIdRef = useRef(null)
  const debounceRef = useRef(null)
  const dataRef = useRef(data)
  dataRef.current = data

  // Load data from Drive on login
  useEffect(() => {
    if (!accessToken) {
      setData(EMPTY_DATA)
      setLoading(false)
      folderIdRef.current = null
      fileIdRef.current = null
      return
    }
    loadFromDrive()
  }, [accessToken])

  async function loadFromDrive() {
    setLoading(true)
    try {
      const folderId = await findOrCreateFolder(accessToken, FOLDER_NAME)
      folderIdRef.current = folderId

      const fileId = await findFile(accessToken, folderId, FILE_NAME)
      if (fileId) {
        fileIdRef.current = fileId
        const json = await readJsonFile(accessToken, fileId)
        if (json) {
          setData({
            cards: json.cards || [],
            topics: json.topics || [],
            reviews: json.reviews || [],
            settings: json.settings || {},
          })
        }
      }
    } catch (err) {
      console.error('Failed to load from Drive:', err)
    } finally {
      setLoading(false)
    }
  }

  // Debounced save to Drive
  const saveToDrive = useCallback(() => {
    if (!accessToken || !folderIdRef.current) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSyncing(true)
      try {
        const result = await writeJsonFile(
          accessToken,
          folderIdRef.current,
          FILE_NAME,
          dataRef.current,
          fileIdRef.current
        )
        if (result.id) fileIdRef.current = result.id
      } catch (err) {
        console.error('Failed to save to Drive:', err)
      } finally {
        setSyncing(false)
      }
    }, DEBOUNCE_MS)
  }, [accessToken])

  function update(updater) {
    setData((prev) => {
      const next = updater(prev)
      return next
    })
    // Schedule a Drive save after state updates
    setTimeout(() => saveToDrive(), 0)
  }

  // --- Cards ---
  function addCards(newCards) {
    update((d) => ({ ...d, cards: [...d.cards, ...newCards] }))
  }

  function updateCard(cardId, changes) {
    update((d) => ({
      ...d,
      cards: d.cards.map((c) => (c.id === cardId ? { ...c, ...changes } : c)),
    }))
  }

  function deleteCard(cardId) {
    update((d) => ({ ...d, cards: d.cards.filter((c) => c.id !== cardId) }))
  }

  // --- Topics ---
  function addTopic(topic) {
    update((d) => ({ ...d, topics: [...d.topics, topic] }))
  }

  function updateTopic(topicId, changes) {
    update((d) => ({
      ...d,
      topics: d.topics.map((t) => (t.id === topicId ? { ...t, ...changes } : t)),
    }))
  }

  function deleteTopic(topicId) {
    update((d) => ({ ...d, topics: d.topics.filter((t) => t.id !== topicId) }))
  }

  // --- Reviews ---
  function addReview(review) {
    update((d) => ({ ...d, reviews: [...d.reviews, review] }))
  }

  // --- Settings ---
  function updateSettings(changes) {
    update((d) => ({ ...d, settings: { ...d.settings, ...changes } }))
  }

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        syncing,
        addCards,
        updateCard,
        deleteCard,
        addTopic,
        updateTopic,
        deleteTopic,
        addReview,
        updateSettings,
        reload: loadFromDrive,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
