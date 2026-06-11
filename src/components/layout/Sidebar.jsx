import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut,
  ChevronDown, ChevronRight, Layers, Sun, Moon, Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useTopics } from '../../hooks/useTopics'
import TopicBadge from '../topics/TopicBadge'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/study', label: 'Study', icon: BookOpen },
  { to: '/create', label: 'Create Cards', icon: PlusCircle },
  { to: '/topics', label: 'Topics', icon: Layers },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { topics } = useTopics()
  const navigate = useNavigate()
  const [topicsOpen, setTopicsOpen] = useState(true)

  const linkBase =
    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150'
  const activeClass = 'bg-primary/10 text-accent font-semibold'
  const inactiveClass = 'text-muted hover:bg-raised hover:text-text'

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-line px-4 py-6 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary grid place-items-center shadow-lg shadow-primary/20">
          <Zap className="w-5 h-5 text-on-primary" fill="currentColor" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">FlashDSA</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Topics list */}
      <div className="mt-4">
        <button
          onClick={() => setTopicsOpen((o) => !o)}
          className="flex items-center gap-2 w-full px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-muted/70 hover:text-muted"
        >
          {topicsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Topics
        </button>
        {topicsOpen && (
          <div className="flex flex-col gap-0.5 mt-1 max-h-64 overflow-y-auto no-scrollbar">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/topics/${t.id}`)}
                className="flex items-center justify-between px-3.5 py-1.5 rounded-xl text-sm text-muted hover:bg-raised hover:text-text transition-colors"
              >
                <span className="truncate">{t.name}</span>
                <TopicBadge topic={t} compact />
              </button>
            ))}
            {topics.length === 0 && (
              <p className="px-3 py-1 text-xs text-muted/60">No topics yet</p>
            )}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom */}
      <div className="flex flex-col gap-1 border-t border-line pt-4">
        <button
          onClick={toggleTheme}
          className={`${linkBase} ${inactiveClass}`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {user && (
          <div className="flex items-center gap-3 px-3.5 py-2">
            <img
              src={user.photoURL || ''}
              alt={user.displayName}
              className="w-7 h-7 rounded-full object-cover bg-raised"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.displayName}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-full text-muted hover:text-coral transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
