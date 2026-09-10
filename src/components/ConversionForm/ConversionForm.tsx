import { useState } from 'react'
import { X, MapPin } from 'lucide-react'
import type {
  ConversionMode,
  DDCoordinate,
  DMSCoordinate,
} from '../../types/coordinate'
import { ddToDMS, dmsToDD, formatDD, formatDMS } from '../../utils/coordinateConversion'
import { DmsFieldGroup } from './DmsFieldGroup'
import { DdFieldGroup } from './DdFieldGroup'
import { ResultRow } from './ResultRow'
import { Button, Separator } from '../ui'

const DEFAULT_DMS: DMSCoordinate = {
  latitude: { degrees: 90, minutes: 0, seconds: 0, direction: 'N' },
  longitude: { degrees: 33, minutes: 13, seconds: 48, direction: 'E' },
}

const DEFAULT_DD: DDCoordinate = { latitude: 90, longitude: 33.23 }

/**
 * Props for {@link ConversionForm}.
 */
export interface ConversionFormProps {
  /** Whether the popup is currently open. */
  isOpen: boolean
  /** Called when the user requests to close the popup. */
  onClose: () => void
  /**
   * Called when the user clicks "Add To Maps" with the resulting
   * decimal-degree coordinate.
   */
  onAddToMaps: (coordinate: DDCoordinate) => void
  /**
   * Optional coordinate to prefill the form with (e.g. from a map
   * click or an existing marker being edited).
   */
  prefill?: DDCoordinate
  /** Whether the form is editing an existing marker (vs. adding a new one). */
  isEditing?: boolean
}

/**
 * Slide-in side-panel form for DMS ⇄ DD coordinate conversion.
 * Uses shadcn-style ui primitives and lucide-react icons.
 */
export function ConversionForm({
  isOpen,
  onClose,
  onAddToMaps,
  prefill,
  isEditing = false,
}: ConversionFormProps) {
  const [mode, setMode] = useState<ConversionMode>(
    prefill ? 'DD_TO_DMS' : 'DMS_TO_DD',
  )
  const [dmsInput, setDmsInput] = useState<DMSCoordinate>(DEFAULT_DMS)
  const [ddInput, setDdInput] = useState<DDCoordinate>(prefill ?? DEFAULT_DD)
  const [result, setResult] = useState<DDCoordinate | DMSCoordinate | null>(null)

  if (!isOpen) return null

  const handleConvert = () => {
    if (mode === 'DMS_TO_DD') {
      setResult(dmsToDD(dmsInput))
    } else {
      setResult(ddToDMS(ddInput))
    }
  }

  const handleAddToMaps = () => {
    const coordinate: DDCoordinate =
      mode === 'DMS_TO_DD'
        ? (result as DDCoordinate) ?? dmsToDD(dmsInput)
        : ddInput
    onAddToMaps(coordinate)
    setResult(null)
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Side panel ── */}
      <div
        data-testid="conversion-form"
        className="animate-slide-in-right absolute right-0 top-0 z-30 flex h-full w-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl sm:w-[380px]"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Coordinate Converter
            </h2>
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

        {/* ── Scrollable body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">

          {/* ── Tab switcher ── */}
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
                onClick={() => {
                  setMode(tab.value)
                  setResult(null)
                }}
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

          {/* ── Description ── */}
          <p className="text-xs text-zinc-600">
            {mode === 'DMS_TO_DD'
              ? 'Enter degrees, minutes & seconds to get decimal degrees.'
              : 'Enter decimal degrees to get DMS format.'}
          </p>

          {/* ── Input fields ── */}
          <div className="space-y-3">
            {mode === 'DMS_TO_DD' ? (
              <>
                <DmsFieldGroup
                  label="Latitude"
                  value={dmsInput.latitude}
                  direction={dmsInput.latitude.direction}
                  directionOptions={['N', 'S']}
                  onChange={(v) =>
                    setDmsInput((prev) => ({
                      ...prev,
                      latitude: { ...prev.latitude, ...v },
                    }))
                  }
                  onDirectionChange={(d) =>
                    setDmsInput((prev) => ({
                      ...prev,
                      latitude: { ...prev.latitude, direction: d as 'N' | 'S' },
                    }))
                  }
                />
                <DmsFieldGroup
                  label="Longitude"
                  value={dmsInput.longitude}
                  direction={dmsInput.longitude.direction}
                  directionOptions={['E', 'W']}
                  onChange={(v) =>
                    setDmsInput((prev) => ({
                      ...prev,
                      longitude: { ...prev.longitude, ...v },
                    }))
                  }
                  onDirectionChange={(d) =>
                    setDmsInput((prev) => ({
                      ...prev,
                      longitude: {
                        ...prev.longitude,
                        direction: d as 'E' | 'W',
                      },
                    }))
                  }
                />
              </>
            ) : (
              <>
                <DdFieldGroup
                  label="Latitude"
                  value={ddInput.latitude}
                  onChange={(v) =>
                    setDdInput((prev) => ({ ...prev, latitude: v }))
                  }
                />
                <DdFieldGroup
                  label="Longitude"
                  value={ddInput.longitude}
                  onChange={(v) =>
                    setDdInput((prev) => ({ ...prev, longitude: v }))
                  }
                />
              </>
            )}
          </div>

          {/* ── Convert ── */}
          <Button className="w-full" size="md" onClick={handleConvert}>
            Convert
          </Button>

          {/* ── Result ── */}
          {result && (
            <div className="animate-fade-in space-y-3">
              <Separator label="Result" />

              <div className="space-y-2">
                {mode === 'DMS_TO_DD' ? (
                  <>
                    <ResultRow
                      label="Latitude"
                      value={formatDD((result as DDCoordinate).latitude)}
                    />
                    <ResultRow
                      label="Longitude"
                      value={formatDD((result as DDCoordinate).longitude)}
                    />
                  </>
                ) : (
                  <>
                    <ResultRow
                      label="Latitude"
                      value={formatDMS((result as DMSCoordinate).latitude)}
                    />
                    <ResultRow
                      label="Longitude"
                      value={formatDMS((result as DMSCoordinate).longitude)}
                    />
                  </>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                size="md"
                onClick={handleAddToMaps}
              >
                <MapPin aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                {isEditing ? 'Update Marker' : 'Add To Map'}
              </Button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-zinc-800 px-5 py-3">
          <p className="text-center text-[10px] text-zinc-700">
            You can also click anywhere on the map to pick coordinates
          </p>
        </div>
      </div>
    </>
  )
}