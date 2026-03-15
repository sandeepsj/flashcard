import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSpeech } from '../hooks/useSpeech'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { Sun, Moon } from 'lucide-react'

const RATES = [
  { label: 'Slow', value: 0.75 },
  { label: 'Normal', value: 1.0 },
  { label: 'Fast', value: 1.25 },
]

export default function Settings() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const { voices } = useSpeech()
  const [settings, setSettings] = useState({ speechRate: 1.0, voiceURI: '', theme: 'light' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid, 'settings', 'app'))
      .then((snap) => { if (snap.exists()) setSettings((s) => ({ ...s, ...snap.data() })) })
      .catch(() => {})
  }, [user])

  async function save() {
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'app'), settings, { merge: true })
      toast({ message: 'Settings saved', type: 'success' })
    } catch (e) {
      toast({ message: e.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      {/* Theme */}
      <Section title="Appearance">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Dark mode</span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Section>

      {/* Speech */}
      <Section title="Text-to-Speech">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Speed</label>
            <div className="flex gap-2">
              {RATES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSettings((s) => ({ ...s, speechRate: value }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    settings.speechRate === value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => setSettings((s) => ({ ...s, voiceURI: e.target.value }))}
                className="block w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">System default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.displayName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        <Button variant="danger" size="sm" onClick={signOut}>Sign Out</Button>
      </Section>

      <Button fullWidth onClick={save} loading={saving}>Save Settings</Button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  )
}
