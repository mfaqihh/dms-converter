import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * Base text/number input with consistent styling.
 * Forwards its ref and accepts all standard HTML input attributes.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={[
        'flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950',
        'px-3 py-1 text-sm text-white shadow-sm',
        'placeholder:text-zinc-600',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Hide native number spinner arrows
        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        className,
      ].join(' ')}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
