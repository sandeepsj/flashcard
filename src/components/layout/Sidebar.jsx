import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut,
  ChevronDown, ChevronRight, Layers, Sun, Moon,
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
    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150'
  const activeClass = 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
  const inactiveClass =
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">FlashDSA</span>
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
          className="flex items-center gap-2 w-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <span className="truncate">{t.name}</span>
                <TopicBadge topic={t} compact />
              </button>
            ))}
            {topics.length === 0 && (
              <p className="px-3 py-1 text-xs text-gray-400 dark:text-gray-600">No topics yet</p>
            )}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom */}
      <div className="flex flex-col gap-1 border-t border-gray-200 dark:border-gray-800 pt-4">
        <button
          onClick={toggleTheme}
          className={`${linkBase} ${inactiveClass}`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user.photoURL || ''}
              alt={user.displayName}
              className="w-7 h-7 rounded-full object-cover bg-gray-200"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{user.displayName}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
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
