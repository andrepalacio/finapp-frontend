interface Props {
  pct:       number   // 0-100
  size?:     number
  stroke?:   number
  color?:    string
}

export function ProgressRing({ pct, size = 80, stroke = 6, color = 'var(--emerald)' }: Props) {
  const r           = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset      = circumference - (Math.min(pct, 100) / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--surface-2)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  )
}
