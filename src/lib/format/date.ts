const LOCALE = 'es-CO'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
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
