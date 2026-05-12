export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 bg-surface rounded w-48" />
      <div className="space-y-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-surface rounded-[var(--r-lg)] border border-line h-16" />
        ))}
      </div>
    </div>
  )
}
