import type { ChangeEvent } from 'react'
import { Input, Label } from '../../ui'

/** Props for {@link DdFieldGroup}. */
export interface DdFieldGroupProps {
  /** Field label, e.g. "Latitude" or "Longitude". */
  label: string
  /** Current decimal-degree value. */
  value: number
  /** Called with the updated value when the input changes. */
  onChange: (value: number) => void
  /**
   * Validation error message to display below the input.
   * When set, the fieldset border and input ring turn red.
   */
  error?: string
}

/**
 * Input field for one DD (Decimal Degrees) axis.
 * Falls back to `0` if the user clears the input.
 * Pass an `error` string to show inline validation feedback.
 */
export function DdFieldGroup({ label, value, onChange, error }: DdFieldGroupProps) {
  const id = `dd-${label.toLowerCase()}`

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numeric = Number(event.target.value)
    onChange(Number.isNaN(numeric) ? 0 : numeric)
  }

  return (
    <fieldset
      className={[
        'space-y-2 rounded-md border p-3 transition-colors',
        error ? 'border-red-500/60' : 'border-zinc-800',
      ].join(' ')}
    >
      <legend className="px-1">
        <Label>{label}</Label>
      </legend>

      <div className="space-y-1.5">
        <Label htmlFor={id}>Decimal Degrees</Label>
        <div className="relative">
          <Input
            id={id}
            type="number"
            step="0.000001"
            aria-label={`${label} decimal degrees`}
            value={value}
            onChange={handleChange}
            className={`pr-6 text-right ${error ? 'border-red-500/60 focus-visible:ring-red-500' : ''}`}
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
            °
          </span>
        </div>
      </div>

      {/* Inline validation error */}
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </fieldset>
  )
}
