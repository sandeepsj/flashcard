import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useSpeech } from '../hooks/useSpeech'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

const RATES = [
  { label: 'Slow', value: 0.75 },
  { label: 'Normal', value: 1.0 },
  { label: 'Fast', value: 1.25 },
]

export default function Settings() {
  const { user, signOut } = useAuth()
  const { data, updateSettings } = useData()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const { voices } = useSpeech()
  const [settings, setSettings] = useState({ speechRate: 1.0, voiceURI: '', theme: 'light' })

  useEffect(() => {
    if (data.settings) {
      setSettings((s) => ({ ...s, ...data.settings }))
    }
  }, [data.settings])

  function save() {
    updateSettings(settings)
    toast({ message: 'Settings saved', type: 'success' })
  }

  return (
    <div className="p-4 lg:p-8 max-w-lg mx-auto space-y-5">
      <div className="pt-2 animate-rise">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Settings<span className="text-accent">.</span>
        </h1>
      </div>

      {/* Theme */}
      <Section title="Appearance" delay="80ms">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark mode</span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary' : 'bg-raised border border-line'
            }`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Section>

      {/* Speech */}
      <Section title="Text-to-Speech" delay="150ms">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-muted mb-2">Speed</label>
            <div className="flex rounded-full bg-raised border border-line p-1">
              {RATES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSettings((s) => ({ ...s, speechRate: value }))}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                    settings.speechRate === value
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {voices.length > 0 && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-muted mb-2">Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => setSettings((s) => ({ ...s, voiceURI: e.target.value }))}
                className="field"
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
      <Section title="Account" delay="220ms">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full bg-raised" />
            <div>
              <p className="text-sm font-semibold">{user.displayName}</p>
              <p className="text-xs text-muted font-mono">{user.email}</p>
            </div>
          </div>
        )}
        <Button variant="danger" size="sm" onClick={signOut}>Sign Out</Button>
      </Section>

      <div className="animate-rise" style={{ animationDelay: '290ms' }}>
        <Button fullWidth size="lg" onClick={save}>Save Settings</Button>
      </div>
    </div>
  )
}

function Section({ title, children, delay = '0ms' }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 animate-rise" style={{ animationDelay: delay }}>
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-4">{title}</h2>
      {children}
    </div>
  )
}
