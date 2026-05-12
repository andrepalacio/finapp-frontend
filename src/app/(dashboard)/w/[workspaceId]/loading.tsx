export default function WorkspaceLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 bg-surface rounded w-40" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-[var(--r-lg)] border border-line p-5 h-28" />
        ))}
      </div>
    </div>
  )
}
