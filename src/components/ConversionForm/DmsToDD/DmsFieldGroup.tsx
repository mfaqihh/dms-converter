import type { ChangeEvent } from 'react'
import type { DMSValue } from '../../../types/coordinate'
import { Input, Select, Label } from '../../ui'

/** Props for {@link DmsFieldGroup}. */
export interface DmsFieldGroupProps {
  /** Field label, e.g. "Latitude" or "Longitude". */
  label: string
  /** Current degrees/minutes/seconds value. */
  value: DMSValue
  /** Called with the updated partial value whenever a sub-field changes. */
  onChange: (value: DMSValue) => void
  /** Current compass direction, e.g. "N" or "E". */
  direction: string
  /** Options shown in the direction selector, e.g. ["N", "S"]. */
  directionOptions: readonly string[]
  /** Called when the direction selector changes. */
  onDirectionChange: (direction: string) => void
}

/**
 * Input group for one DMS axis (latitude or longitude).
 *
 * Renders Degrees, Minutes, Seconds, and Direction in a 4-column grid
 * inside a `<fieldset>` so screen readers associate all inputs with
 * the axis label.
 */
export function DmsFieldGroup({
  label,
  value,
  onChange,
  direction,
  directionOptions,
  onDirectionChange,
}: DmsFieldGroupProps) {
  // Use the label as a stable ID prefix to connect <Label> and <Input>.
  const id = label.toLowerCase()

  /**
   * Returns a change handler for the given DMS field.
   * Falls back to 0 if the user clears the input.
   */
  const handleFieldChange =
    (field: keyof DMSValue) => (event: ChangeEvent<HTMLInputElement>) => {
      const numeric = Number(event.target.value)
      onChange({ ...value, [field]: Number.isNaN(numeric) ? 0 : numeric })
    }

  return (
    <fieldset className="space-y-2 rounded-md border border-zinc-800 p-3">
      <legend className="px-1">
        <Label>{label}</Label>
      </legend>

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
