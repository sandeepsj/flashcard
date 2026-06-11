import React from 'react'

export default function Input({
  label,
  error,
  className = '',
  textarea = false,
  rows = 4,
  ...props
}) {
  const borderClass = error ? '!border-coral focus:!ring-coral/50' : ''

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-mono font-medium uppercase tracking-[0.15em] text-muted mb-1.5">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea rows={rows} className={`field resize-y ${borderClass}`} {...props} />
      ) : (
        <input className={`field ${borderClass}`} {...props} />
      )}
      {error && <p className="mt-1.5 text-xs text-coral">{error}</p>}
    </div>
  )
}
