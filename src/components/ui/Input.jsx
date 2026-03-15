import React from 'react'

export default function Input({
  label,
  error,
  className = '',
  textarea = false,
  rows = 4,
  ...props
}) {
  const base =
    'block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const borderClass = error
    ? 'border-red-400 dark:border-red-500'
    : 'border-gray-300 dark:border-gray-600'

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          rows={rows}
          className={`${base} ${borderClass} px-3 py-2 resize-y`}
          {...props}
        />
      ) : (
        <input className={`${base} ${borderClass} px-3 py-2`} {...props} />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
