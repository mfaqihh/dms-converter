import type { ChangeEvent } from 'react'
import type { DMSValue } from '../../types/coordinate'
import { Input, Select, Label } from '../ui'

/**
 * Props for {@link DmsFieldGroup}.
 */
export interface DmsFieldGroupProps {
  /** Field label, e.g. "Latitude" or "Longitude". */
  label: string
  /** Current degrees/minutes/seconds value. */
  value: DMSValue
  /** Called with the updated value whenever any sub-field changes. */
  onChange: (value: DMSValue) => void
  /** Direction selector value, e.g. "N" or "E". */
  direction: string
  /** Available direction options, e.g. ["N", "S"]. */
  directionOptions: readonly string[]
  /** Called when the direction selector changes. */
  onDirectionChange: (direction: string) => void
}

/**
 * A labeled group of Degrees / Minutes / Seconds inputs plus a
 * compass-direction selector for one DMS axis (latitude or longitude).
 *
 * Each sub-field has its own `<Label>` so the layout is self-documenting
 * and accessible without extra ARIA attributes.
 */
export function DmsFieldGroup({
  label,
  value,
  onChange,
  direction,
  directionOptions,
  onDirectionChange,
}: DmsFieldGroupProps) {
  const id = label.toLowerCase()

  const handleFieldChange =
    (field: keyof DMSValue) => (event: ChangeEvent<HTMLInputElement>) => {
      const numeric = Number(event.target.value)
      onChange({ ...value, [field]: Number.isNaN(numeric) ? 0 : numeric })
    }

  return (
    <fieldset className="space-y-2 rounded-md border border-zinc-800 p-3">
      {/* Section title */}
      <legend className="px-1">
        <Label>{label}</Label>
      </legend>

      {/* 4-column grid: Deg | Min | Sec | Dir */}
      <div className="grid grid-cols-4 gap-2">
        {/* Degrees */}
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-deg`}>Deg</Label>
          <div className="relative">
            <Input
              id={`${id}-deg`}
              type="number"
              aria-label={`${label} degrees`}
              value={value.degrees}
              min={0}
              onChange={handleFieldChange('degrees')}
              className="pr-5 text-right"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
              °
            </span>
          </div>
        </div>

        {/* Minutes */}
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-min`}>Min</Label>
          <div className="relative">
            <Input
              id={`${id}-min`}
              type="number"
              aria-label={`${label} minutes`}
              value={value.minutes}
              min={0}
              max={59}
              onChange={handleFieldChange('minutes')}
              className="pr-5 text-right"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
              ′
            </span>
          </div>
        </div>

        {/* Seconds */}
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-sec`}>Sec</Label>
          <div className="relative">
            <Input
              id={`${id}-sec`}
              type="number"
              aria-label={`${label} seconds`}
              value={value.seconds}
              min={0}
              max={59.999}
              step={0.001}
              onChange={handleFieldChange('seconds')}
              className="pr-5 text-right"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
              ″
            </span>
          </div>
        </div>

        {/* Direction */}
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-dir`}>Dir</Label>
          <Select
            id={`${id}-dir`}
            aria-label={`${label} direction`}
            value={direction}
            onChange={(event) => onDirectionChange(event.target.value)}
          >
            {directionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </fieldset>
  )
}