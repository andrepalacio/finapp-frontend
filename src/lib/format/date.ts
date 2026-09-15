const LOCALE = 'es-CO'

// Bare YYYY-MM-DD parses as UTC midnight per spec, which shifts a day
// backwards once formatted in a timezone behind UTC (e.g. America/Bogota).
// Force local-time parsing instead. Accepts either a bare date or a full
// timestamp (the backend sends RFC3339, e.g. "2026-09-15T00:00:00Z").
function parseLocalISO(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00`)
}

export function formatDate(iso: string): string {
  return parseLocalISO(iso).toLocaleDateString(LOCALE, {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function formatDateShort(iso: string): string {
  return parseLocalISO(iso).toLocaleDateString(LOCALE, {
    day:   '2-digit',
    month: 'short',
  })
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString(LOCALE, {
    month: 'long',
    year:  'numeric',
  })
}

// toISOString() converts to UTC first, which rolls the date forward once the
// local clock is behind UTC (e.g. evenings in America/Bogota). Build the
// YYYY-MM-DD string from local getters instead.
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO(): string {
  return toISODate(new Date())
}
