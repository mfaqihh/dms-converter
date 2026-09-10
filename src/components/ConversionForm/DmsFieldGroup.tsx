import type { ChangeEvent } from 'react'
import type { DMSValue } from '../../types/coordinate'

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
 * A labeled group of degree / minute / second number inputs plus a
 * compass-direction selector, used for entering one DMS value
 * (latitude or longitude) in the conversion form.
 */
export function DmsFieldGroup({
  label,
  value,
  onChange,
  direction,
  directionOptions,
  onDirectionChange,
}: DmsFieldGroupProps) {
  const handleFieldChange =
    (field: keyof DMSValue) => (event: ChangeEvent<HTMLInputElement>) => {
      const numeric = Number(event.target.value)
      onChange({ ...value, [field]: Number.isNaN(numeric) ? 0 : numeric })
    }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <label className="text-sm text-slate-300">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          aria-label={`${label} degrees`}
          value={value.degrees}
          onChange={handleFieldChange('degrees')}
          className="w-14 rounded bg-slate-700 px-1.5 py-1 text-right text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <span className="text-slate-400">°</span>
        <input
          type="number"
          aria-label={`${label} minutes`}
          value={value.minutes}
          onChange={handleFieldChange('minutes')}
          className="w-12 rounded bg-slate-700 px-1.5 py-1 text-right text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <span className="text-slate-400">'</span>
        <input
          type="number"
          aria-label={`${label} seconds`}
          value={value.seconds}
          onChange={handleFieldChange('seconds')}
          className="w-14 rounded bg-slate-700 px-1.5 py-1 text-right text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <span className="text-slate-400">"</span>
        <select
          aria-label={`${label} direction`}
          value={direction}
          onChange={(event) => onDirectionChange(event.target.value)}
          className="ml-1 rounded bg-slate-700 px-1 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400"
        >
          {directionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}