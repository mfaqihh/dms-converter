import type { ChangeEvent } from 'react'

/**
 * Props for {@link DdFieldGroup}.
 */
export interface DdFieldGroupProps {
  /** Field label, e.g. "Latitude" or "Longitude". */
  label: string
  /** Current decimal-degree value. */
  value: number
  /** Called with the updated value when the input changes. */
  onChange: (value: number) => void
}

/**
 * A labeled decimal-degree number input, used for entering one DD
 * value (latitude or longitude) in the conversion form.
 */
export function DdFieldGroup({ label, value, onChange }: DdFieldGroupProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numeric = Number(event.target.value)
    onChange(Number.isNaN(numeric) ? 0 : numeric)
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <label className="text-sm text-slate-300">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step="0.000001"
          aria-label={`${label} decimal degrees`}
          value={value}
          onChange={handleChange}
          className="w-32 rounded bg-slate-700 px-1.5 py-1 text-right text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <span className="text-slate-400">deg</span>
      </div>
    </div>
  )
}