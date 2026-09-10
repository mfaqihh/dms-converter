import { forwardRef } from 'react'
import type { LabelHTMLAttributes } from 'react'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

/**
 * Small uppercase label for form fields.
 * Always pair with an input via `htmlFor` for accessibility.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => (
    <label
      ref={ref}
      className={[
        'text-[10px] font-semibold uppercase tracking-widest text-zinc-500',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </label>
  ),
)
Label.displayName = 'Label'
