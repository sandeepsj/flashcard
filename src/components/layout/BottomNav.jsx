import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, PlusCircle, Layers, Settings } from 'lucide-react'

const items = [
  { to: '/', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/study', icon: BookOpen, label: 'Study' },
  { to: '/create', icon: PlusCircle, label: 'Create' },
  { to: '/topics', icon: Layers, label: 'Topics' },
  { to: '/settings', icon: Settings, label: 'More' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed inset-x-4 z-40 bottom-nav-float">
      <div className="mx-auto max-w-md flex items-center gap-1 rounded-[1.625rem] border border-line bg-surface/85 backdrop-blur-xl p-1.5 shadow-float">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 h-11 rounded-full transition-all duration-200 ${
                isActive
                  ? 'flex-[1.7] bg-primary text-on-primary shadow-md shadow-primary/25'
                  : 'flex-1 text-muted hover:text-text active:bg-raised'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
