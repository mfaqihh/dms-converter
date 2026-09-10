import { useState } from 'react'
import type {
  ConversionMode,
  DDCoordinate,
  DMSCoordinate,
} from '../../types/coordinate'
import { ddToDMS, dmsToDD, formatDD, formatDMS } from '../../utils/coordinateConversion'
import { DmsFieldGroup } from './DmsFieldGroup'
import { DdFieldGroup } from './DdFieldGroup'

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
}

/**
 * Slide-in popup form that lets the user convert coordinates between
 * DMS and DD, switch direction via tabs, and push the converted
 * result onto the map.
 */
export function ConversionForm({
  isOpen,
  onClose,
  onAddToMaps,
  prefill,
}: ConversionFormProps) {
  const [mode, setMode] = useState<ConversionMode>(
    prefill ? 'DD_TO_DMS' : 'DMS_TO_DD',
  )
  const [dmsInput, setDmsInput] = useState<DMSCoordinate>(DEFAULT_DMS)
  const [ddInput, setDdInput] = useState<DDCoordinate>(prefill ?? DEFAULT_DD)
  const [result, setResult] = useState<DDCoordinate | DMSCoordinate | null>(
    null,
  )

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
    <div
      data-testid="conversion-form"
      className="absolute right-0 top-0 z-20 h-full w-full max-w-sm bg-slate-900/95 p-4 text-white shadow-2xl sm:right-4 sm:top-4 sm:h-auto sm:rounded-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('DMS_TO_DD')
              setResult(null)
            }}
            className={
              mode === 'DMS_TO_DD'
                ? 'border-b-2 border-emerald-400 pb-1 text-emerald-400'
                : 'pb-1 text-slate-400'
            }
          >
            DMS To DD
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('DD_TO_DMS')
              setResult(null)
            }}
            className={
              mode === 'DD_TO_DMS'
                ? 'border-b-2 border-emerald-400 pb-1 text-emerald-400'
                : 'pb-1 text-slate-400'
            }
          >
            DD to DMS
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        {mode === 'DMS_TO_DD'
          ? 'Convert Cordinate DMS to DD'
          : 'Convert Cordinate dd to dms'}
      </p>

      {mode === 'DMS_TO_DD' ? (
        <>
          <DmsFieldGroup
            label="Latitude"
            value={dmsInput.latitude}
            direction={dmsInput.latitude.direction}
            directionOptions={['N', 'S']}
            onChange={(value) =>
              setDmsInput((prev) => ({
                ...prev,
                latitude: { ...prev.latitude, ...value },
              }))
            }
            onDirectionChange={(direction) =>
              setDmsInput((prev) => ({
                ...prev,
                latitude: { ...prev.latitude, direction: direction as 'N' | 'S' },
              }))
            }
          />
          <DmsFieldGroup
            label="Longitude"
            value={dmsInput.longitude}
            direction={dmsInput.longitude.direction}
            directionOptions={['E', 'W']}
            onChange={(value) =>
              setDmsInput((prev) => ({
                ...prev,
                longitude: { ...prev.longitude, ...value },
              }))
            }
            onDirectionChange={(direction) =>
              setDmsInput((prev) => ({
                ...prev,
                longitude: {
                  ...prev.longitude,
                  direction: direction as 'E' | 'W',
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
            onChange={(value) =>
              setDdInput((prev) => ({ ...prev, latitude: value }))
            }
          />
          <DdFieldGroup
            label="Longitude"
            value={ddInput.longitude}
            onChange={(value) =>
              setDdInput((prev) => ({ ...prev, longitude: value }))
            }
          />
        </>
      )}

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-medium text-slate-900 hover:bg-emerald-400"
        >
          convert
        </button>
      </div>

      {result && (
        <div className="mt-4 border-t border-slate-700 pt-3">
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

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleAddToMaps}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-slate-900 hover:bg-emerald-400"
            >
              Add To Maps
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Small display row used for showing a converted latitude/longitude value. */
function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
  )
}