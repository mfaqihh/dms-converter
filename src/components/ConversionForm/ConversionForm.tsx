import { useState } from 'react'
import { X } from 'lucide-react'
import type { ConversionMode, DDCoordinate } from '../../types/coordinate'
import { DmsToDdForm } from './DmsToDD'
import { DdToDmsForm } from './DDToDms'
import { Button } from '../ui'

/** Props for {@link ConversionForm}. */
export interface ConversionFormProps {
  /** Whether the panel is visible. */
  isOpen: boolean
  /** Called when the user requests to close the panel. */
  onClose: () => void
  /**
   * Called by either sub-form when the user confirms a coordinate.
   * The coordinate is always in DD format.
   */
  onAddToMaps: (coordinate: DDCoordinate) => void
  /**
   * Pre-fills the DD inputs (e.g. from a map click or an existing marker).
   * Only used by {@link DdToDmsForm}.
   */
  prefill?: DDCoordinate
  /** When `true`, sub-forms show "Update Marker" instead of "Add To Map". */
  isEditing?: boolean
}

/**
 * Side-panel container (`«component» Form` in the component diagram).
 *
 * Owns only the conversion-mode tab state. The actual input and
 * conversion logic lives in the two child components:
 * - {@link DmsToDdForm} — converts DMS → DD  (`DmsToDD/`)
 * - {@link DdToDmsForm} — converts DD → DMS  (`DDToDms/`)
 */
export function ConversionForm({
  isOpen,
  onClose,
  onAddToMaps,
  prefill,
  isEditing = false,
}: ConversionFormProps) {
  // Default to DD_TO_DMS when a prefill coordinate is available.
  const [mode, setMode] = useState<ConversionMode>(
    prefill ? 'DD_TO_DMS' : 'DMS_TO_DD',
  )

  if (!isOpen) return null

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side panel */}
      <div
        data-testid="conversion-form"
        className="animate-slide-in-right absolute right-0 top-0 z-30 flex h-full w-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl sm:w-[380px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Coordinate Converter</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {isEditing ? 'Edit existing marker' : 'Add a new map marker'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 p-0"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">

          {/* Tab switcher — selects which sub-form to render */}
          <div className="flex rounded-md border border-zinc-800 bg-zinc-900 p-0.5">
            {(
              [
                { value: 'DMS_TO_DD', label: 'DMS → DD' },
                { value: 'DD_TO_DMS', label: 'DD → DMS' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMode(tab.value)}
                className={[
                  'flex-1 rounded py-1.5 text-sm font-medium transition-all duration-150',
                  mode === tab.value
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active sub-form */}
          {mode === 'DMS_TO_DD' ? (
            <DmsToDdForm onAddToMaps={onAddToMaps} isEditing={isEditing} />
          ) : (
            <DdToDmsForm
              prefill={prefill}
              onAddToMaps={onAddToMaps}
              isEditing={isEditing}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-3">
          <p className="text-center text-[10px] text-zinc-700">
            You can also click anywhere on the map to pick coordinates
          </p>
        </div>
      </div>
    </>
  )
}