'use client'

import { useState, useMemo }   from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatDate } from '@/lib/format/date'

const DAYS   = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parseISO(iso: string): Date | null {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

interface Props {
  value:       string
  onChange:    (iso: string) => void
  placeholder?: string
  className?:  string
}

export function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha', className }: Props) {
  const selected = parseISO(value)

  const todayRef = useMemo(() => new Date(), [])
  const [viewYear, setViewYear]   = useState(() => selected?.getFullYear() ?? todayRef.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => selected?.getMonth()    ?? todayRef.getMonth())
  const [open, setOpen]           = useState(false)

  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstWeekday = (() => {
    const d = new Date(viewYear, viewMonth, 1).getDay()
    return d === 0 ? 6 : d - 1
  })()

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    onChange(toISO(viewYear, viewMonth, day))
    setOpen(false)
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  const label = selected ? formatDate(value) : placeholder

  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, i) =>
    i < firstWeekday ? null : i - firstWeekday + 1
  )
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] transition-colors focus:outline-none focus:border-ink ${selected ? 'text-ink' : 'text-ink-4'} ${className ?? ''}`}
        >
          <CalendarDays size={13} className="text-ink-3 shrink-0" />
          <span>{label}</span>
          {selected && (
            <X size={12} className="text-ink-3 hover:text-terra ml-0.5" onClick={clear} />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[232px] p-3 bg-surface border border-line rounded-[var(--r-md)] shadow-[var(--shadow-md)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={prevMonth} className="p-0.5 rounded hover:bg-surface-2 text-ink-3 hover:text-ink transition-colors">
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs font-medium text-ink">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={nextMonth} className="p-0.5 rounded hover:bg-surface-2 text-ink-3 hover:text-ink transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <span key={d} className="text-[10px] text-ink-4 font-medium text-center py-0.5">{d}</span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => {
            if (!day) return <span key={i} />

            const iso      = toISO(viewYear, viewMonth, day)
            const isSelected = iso === value
            const isToday  = day === todayRef.getDate() && viewMonth === todayRef.getMonth() && viewYear === todayRef.getFullYear()

            return (
              <button
                key={i}
                type="button"
                onClick={() => selectDay(day)}
                className={`
                  relative text-[11px] h-7 w-full rounded-[6px] transition-colors
                  ${isSelected
                    ? 'bg-ink text-bg font-medium'
                    : 'text-ink hover:bg-surface-2'}
                `}
              >
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald" />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
