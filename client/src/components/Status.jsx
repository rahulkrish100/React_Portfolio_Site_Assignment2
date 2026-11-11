// Shared feedback UI: loading indicator and success / error / info alerts.

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function Alert({ type = 'info', children, onDismiss }) {
  if (!children) return null
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onDismiss && (
        <button type="button" className="alert-close" aria-label="Dismiss message" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  )
}

export function EmptyState({ children }) {
  return <p className="empty-state">{children}</p>
}
