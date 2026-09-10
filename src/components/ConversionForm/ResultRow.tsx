/**
 * Props for {@link ResultRow}.
 */
export interface ResultRowProps {
  /** Descriptive label shown on the left, e.g. "Latitude". */
  label: string
  /** Formatted value shown on the right, e.g. "49.502778 deg". */
  value: string
}

/**
 * A single read-only display row showing a converted coordinate value.
 * Matches the visual weight of the shadcn input fields.
 */
export function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex h-9 items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="font-mono text-sm text-white">{value}</span>
    </div>
  )
}
