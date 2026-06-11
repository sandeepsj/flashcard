import React from 'react'

const variants = {
  primary: 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110 active:brightness-95',
  secondary: 'bg-surface text-text border border-line hover:border-muted/60 active:bg-raised',
  danger: 'bg-coral text-on-coral shadow-lg shadow-coral/20 hover:brightness-110 active:brightness-95',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-raised',
  success: 'bg-go text-on-go shadow-lg shadow-go/20 hover:brightness-110 active:brightness-95',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
  xl: 'px-6 py-4 text-base min-h-[3.25rem]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight',
        'transition-all duration-150 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}
