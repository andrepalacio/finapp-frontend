export function formatCurrency(amount: number, currency = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style:                 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatAmount(amount: number, currency = 'COP', options?: {
  showSign?: boolean
}): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  if (options?.showSign && amount > 0) return `+${formatted}`
  if (amount < 0) return `-${formatted}`
  return formatted
}
