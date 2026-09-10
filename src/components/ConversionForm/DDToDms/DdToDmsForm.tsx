import { useState } from 'react'
import type { DDCoordinate, DMSCoordinate } from '../../../types/coordinate'
import { ddToDMS, formatDMS } from '../../../utils/coordinateConversion'
import { DdFieldGroup } from './DdFieldGroup'
import { ResultRow } from '../ResultRow'
import { Button, Separator } from '../../ui'
import { MapPin } from 'lucide-react'

const DEFAULT_DD: DDCoordinate = { latitude: 90, longitude: 33.23 }

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
 * Owns its own input state and conversion result. The coordinate passed
 * to `onAddToMaps` is always the original DD input — the DMS output is
 * shown purely for reference.
 */
export function DdToDmsForm({
  prefill,
  onAddToMaps,
  isEditing = false,
}: DdToDmsFormProps) {
  const [ddInput, setDdInput] = useState<DDCoordinate>(prefill ?? DEFAULT_DD)
  const [result, setResult] = useState<DMSCoordinate | null>(null)

  const handleConvert = () => {
    setResult(ddToDMS(ddInput))
  }

  const handleAddToMaps = () => {
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
        onChange={(v) => setDdInput((prev) => ({ ...prev, latitude: v }))}
      />

      <DdFieldGroup
        label="Longitude"
        value={ddInput.longitude}
        onChange={(v) => setDdInput((prev) => ({ ...prev, longitude: v }))}
      />

      <Button className="w-full" size="md" onClick={handleConvert}>
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
