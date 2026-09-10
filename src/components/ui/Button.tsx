import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

/** Visual style of the button. */
type Variant = 'default' | 'outline' | 'ghost'

/** Size preset — controls height and horizontal padding. */
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default 'default' */
  variant?: Variant
  /** @default 'md' */
  size?: Size
}

/** Tailwind classes per variant. */
const variantClass: Record<Variant, string> = {
  default: 'bg-white text-black hover:bg-zinc-100 shadow-sm',
  outline:
    'border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:border-zinc-600',
  ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white',
}

/** Tailwind classes per size. */
const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-sm',
}

/**
 * Reusable button with three visual variants (`default`, `outline`, `ghost`)
 * and three sizes (`sm`, `md`, `lg`).
 *
 * Defaults to `type="button"` to prevent accidental form submission.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
