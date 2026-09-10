import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={[
          'flex h-9 w-full appearance-none rounded-md border border-zinc-800 bg-zinc-950',
          'py-1 pl-3 pr-8 text-sm text-white shadow-sm',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>

      {/* Lucide chevron */}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
      />
    </div>
  ),
)
Select.displayName = 'Select'
