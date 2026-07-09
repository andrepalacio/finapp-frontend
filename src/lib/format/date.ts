const LOCALE = 'es-CO'

// Bare YYYY-MM-DD parses as UTC midnight per spec, which shifts a day
// backwards once formatted in a timezone behind UTC (e.g. America/Bogota).
// Force local-time parsing instead.
function parseLocalISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
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

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function todayISO(): string {
  return toISODate(new Date())
}
