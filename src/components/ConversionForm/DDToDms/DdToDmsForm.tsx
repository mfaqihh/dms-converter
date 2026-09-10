import { useState } from 'react'
import type { DDCoordinate, DMSCoordinate } from '../../../types/coordinate'
import { ddToDMS, formatDMS } from '../../../utils/coordinateConversion'
import { validateDDLatitude, validateDDLongitude } from '../../../utils/coordinateValidation'
import { DdFieldGroup } from './DdFieldGroup'
import { ResultRow } from '../ResultRow'
import { Button, Separator } from '../../ui'
import { MapPin } from 'lucide-react'

const DEFAULT_DD: DDCoordinate = { latitude: 0, longitude: 0 }

/** Props for {@link DdToDmsForm}. */
export interface DdToDmsFormProps {
  /**
   * Optional coordinate to prefill the inputs with — useful when the
   * user clicks an existing marker or a point on the map.
   */
  prefill?: DDCoordinate
  /**
   * Called with the original DD coordinate when the user confirms.
   * (The DMS result is display-only; the map always stores DD.)
   */
  onAddToMaps: (coordinate: DDCoordinate) => void
  /** When `true`, the submit button reads "Update Marker" instead of "Add To Map". */
  isEditing?: boolean
}

/**
 * Self-contained form for converting DD → DMS.
 *
 * Validates inputs live — the Convert button is disabled while any field
 * is out of range and inline error messages appear near the offending field.
 * The coordinate sent to `onAddToMaps` is always the original DD input.
 */
export function DdToDmsForm({
  prefill,
  onAddToMaps,
  isEditing = false,
}: DdToDmsFormProps) {
  const [ddInput, setDdInput] = useState<DDCoordinate>(prefill ?? DEFAULT_DD)
  const [result, setResult] = useState<DMSCoordinate | null>(null)

  // Derived validation — recomputed on every render, no extra state needed.
  const latError = validateDDLatitude(ddInput.latitude)
  const lonError = validateDDLongitude(ddInput.longitude)
  const isValid = !latError && !lonError

  const handleConvert = () => {
    if (!isValid) return
    setResult(ddToDMS(ddInput))
  }

  const handleAddToMaps = () => {
    if (!isValid) return
    // Always send the DD input to the map — DMS is for display only.
    onAddToMaps(ddInput)
    setResult(null)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-600">
        Enter decimal degrees to get DMS format.
      </p>

      <DdFieldGroup
        label="Latitude"
        value={ddInput.latitude}
        error={latError ?? undefined}
        onChange={(v) => setDdInput((prev) => ({ ...prev, latitude: v }))}
      />

      <DdFieldGroup
        label="Longitude"
        value={ddInput.longitude}
        error={lonError ?? undefined}
        onChange={(v) => setDdInput((prev) => ({ ...prev, longitude: v }))}
      />

      <Button
        className="w-full"
        size="md"
        onClick={handleConvert}
        disabled={!isValid}
        title={!isValid ? 'Fix the errors above before converting' : undefined}
      >
        Convert
      </Button>

      {result && (
        <div className="animate-fade-in space-y-3">
          <Separator label="Result" />
          <div className="space-y-2">
            <ResultRow label="Latitude" value={formatDMS(result.latitude)} />
            <ResultRow label="Longitude" value={formatDMS(result.longitude)} />
          </div>
          <Button variant="outline" className="w-full" size="md" onClick={handleAddToMaps}>
            <MapPin aria-hidden="true" className="h-4 w-4 text-zinc-400" />
            {isEditing ? 'Update Marker' : 'Add To Map'}
          </Button>
        </div>
      )}
    </div>
  )
}
