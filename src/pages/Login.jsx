import React from 'react'
import { Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithGoogle, error } = useAuth()

  return (
    <div className="relative min-h-screen bg-base text-text dotgrid overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50rem 34rem at 50% -12%, rgb(var(--c-accent) / 0.14), transparent 60%)',
        }}
      />

      {/* Decorative tilted cards */}
      <div className="pointer-events-none absolute -right-10 top-16 w-56 rotate-6 rounded-2xl border border-line bg-surface/70 p-4 shadow-card opacity-70 animate-rise" style={{ animationDelay: '300ms' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">Q —</p>
        <p className="font-display text-sm font-semibold leading-snug">Lookup in a hash map. Average time complexity?</p>
      </div>
      <div className="pointer-events-none absolute -left-12 bottom-24 w-56 -rotate-6 rounded-2xl border border-line bg-surface/70 p-4 shadow-card opacity-70 animate-rise" style={{ animationDelay: '450ms' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">A —</p>
        <p className="font-mono text-sm font-semibold">O(1)</p>
      </div>

      <div className="relative w-full max-w-sm text-center">
        {/* Brand */}
        <div className="inline-flex items-center gap-2.5 mb-8 animate-rise">
          <div className="w-9 h-9 rounded-xl bg-primary grid place-items-center shadow-lg shadow-primary/25">
            <Zap className="w-5 h-5 text-on-primary" fill="currentColor" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">FlashDSA</span>
        </div>

        <h1 className="font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight mb-4 animate-rise" style={{ animationDelay: '80ms' }}>
          Master DSA,
          <br />
          <span className="text-accent">one card</span> at a time.
        </h1>
        <p className="text-muted mb-10 animate-rise" style={{ animationDelay: '160ms' }}>
          Spaced repetition flashcards that live in your Google Drive. Offline-first, distraction-free.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl border border-coral/40 bg-coral/10 text-sm text-coral text-left">
            {error}
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-primary text-on-primary font-semibold px-6 py-4 shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all duration-150 animate-rise"
          style={{ animationDelay: '240ms' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70 animate-rise" style={{ animationDelay: '320ms' }}>
          <span>SM-2 algorithm</span>
          <span className="text-accent">·</span>
          <span>Offline PWA</span>
          <span className="text-accent">·</span>
          <span>Drive sync</span>
        </div>
      </div>
    </div>
  )
}
