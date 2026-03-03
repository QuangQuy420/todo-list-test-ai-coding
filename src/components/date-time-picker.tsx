'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  className?: string
}

function formatDisplay(value: string | null, placeholder: string): string {
  if (!value) return placeholder
  const [datePart, timePart] = value.split('T')
  const date = new Date(datePart + 'T00:00:00')
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  if (!timePart || timePart === '00:00') return dateStr
  const [h, m] = timePart.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${dateStr}, ${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date...',
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Derive date and time parts from value
  const datePart = value ? value.split('T')[0] : undefined
  const timePart = value && value.includes('T') ? value.split('T')[1] : '00:00'

  const selectedDate = datePart ? new Date(datePart + 'T00:00:00') : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newDatePart = `${year}-${month}-${day}`
    onChange(`${newDatePart}T${timePart}`)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!datePart) return
    const newTime = e.target.value
    onChange(`${datePart}T${newTime}`)
  }

  const handleClear = () => {
    onChange(null)
    setOpen(false)
  }

  const displayText = formatDisplay(value, placeholder)
  const hasValue = !!value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'glass-surface justify-start text-left font-normal w-full',
            !hasValue && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 glass-strong border border-white/20 rounded-2xl"
        align="start"
      >
        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />

        {/* Time input — shown after date is selected */}
        {datePart && (
          <div className="border-t border-white/20 pt-3 mt-1">
            <div className="flex items-center gap-2 px-1">
              <label className="text-sm text-muted-foreground shrink-0">Time:</label>
              <input
                type="time"
                value={timePart}
                onChange={handleTimeChange}
                className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                aria-label="Time"
              />
            </div>
          </div>
        )}

        {/* Clear button — only when value is set */}
        {hasValue && (
          <div className="border-t border-white/20 pt-3 mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker
