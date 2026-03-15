import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, PlusCircle, Layers, Settings } from 'lucide-react'

const items = [
  { to: '/', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/study', icon: BookOpen, label: 'Study' },
  { to: '/create', icon: PlusCircle, label: 'Create' },
  { to: '/topics', icon: Layers, label: 'Topics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 bottom-nav-safe">
      <div className="flex items-stretch h-16">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
