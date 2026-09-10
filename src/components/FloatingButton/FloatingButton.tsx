import { Plus, X } from 'lucide-react'

/**
 * Props for {@link FloatingButton}.
 */
export interface FloatingButtonProps {
  /** Called when the button is clicked. */
  onClick: () => void
  /** Accessible label for the button. */
  label?: string
  /** Whether the conversion form panel is currently open. */
  isFormOpen?: boolean
}

/**
 * A circular floating action button positioned in the top-right corner.
 * Shows a Plus icon when the form is closed and an X when it is open.
 */
export function FloatingButton({
  onClick,
  label = 'Open coordinate converter',
  isFormOpen = false,
}: FloatingButtonProps) {
  return (
    <div className="absolute right-4 top-4 z-10">
      {/* Pulse ring — only when closed */}
      {!isFormOpen && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-white"
          style={{ animation: 'pulse-ring 2.2s ease-out infinite' }}
        />
      )}

      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        data-testid="floating-button"
        className={[
          'relative flex h-12 w-12 items-center justify-center rounded-full shadow-2xl',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black',
          isFormOpen
            ? 'bg-zinc-700 hover:bg-zinc-600'
            : 'bg-white hover:scale-110 hover:bg-zinc-100',
        ].join(' ')}
      >
        {isFormOpen ? (
          <X
            aria-hidden="true"
            className="h-5 w-5 text-white transition-colors duration-300"
          />
        ) : (
          <Plus
            aria-hidden="true"
            className="h-5 w-5 text-black transition-colors duration-300"
          />
        )}
      </button>
    </div>
  )
}