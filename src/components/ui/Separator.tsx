export function Separator({ label }: { label?: string }) {
  if (!label) {
    return <div className="my-1 h-px bg-zinc-800" />
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {label}
      </span>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  )
}
