'use client'

import { useState }   from 'react'
import { ChevronDown, X, Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value:        string
  onChange:     (value: string) => void
  options:      SelectOption[]
  placeholder?: string
  clearable?:   boolean
  disabled?:    boolean
  className?:   string
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  clearable = false,
  disabled = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  function pick(v: string) {
    onChange(v)
    setOpen(false)
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(v) => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-surface border border-line rounded-[var(--r-sm)] transition-colors focus:outline-none focus:border-ink ${selected ? 'text-ink' : 'text-ink-4'} disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          {clearable && selected ? (
            <X size={12} className="text-ink-3 hover:text-terra shrink-0" onClick={clear} />
          ) : (
            <ChevronDown
              size={12}
              className={`text-ink-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="p-1 bg-surface border border-line rounded-[var(--r-md)] shadow-[var(--shadow-md)]"
        style={{ minWidth: 'var(--radix-popover-trigger-width)', width: 'max-content', maxWidth: 260 }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => pick(opt.value)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-xs rounded-[6px] text-left transition-colors ${
              opt.value === value
                ? 'bg-ink text-bg'
                : 'text-ink hover:bg-surface-2'
            }`}
          >
            <span className="truncate">{opt.label}</span>
            {opt.value === value && <Check size={12} className="shrink-0" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
