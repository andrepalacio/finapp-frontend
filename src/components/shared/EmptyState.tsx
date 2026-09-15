interface Props {
  title:        string
  description?: string
  actionLabel?: string
  onAction?:    () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="bg-surface rounded-[var(--r-lg)] border border-line px-6 py-12 text-center">
      <p className={`text-ink-3 text-sm${actionLabel ? ' mb-3' : ''}`}>{title}</p>
      {description && <p className="text-ink-4 text-xs mt-1">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
