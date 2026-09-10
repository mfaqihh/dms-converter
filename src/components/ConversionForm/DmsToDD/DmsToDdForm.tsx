import { useState } from 'react'
import type { DDCoordinate, DMSCoordinate } from '../../../types/coordinate'
import { dmsToDD, formatDD } from '../../../utils/coordinateConversion'
import { DmsFieldGroup } from './DmsFieldGroup'
import { ResultRow } from '../ResultRow'
import { Button, Separator } from '../../ui'
import { MapPin } from 'lucide-react'

const DEFAULT_DMS: DMSCoordinate = {
  latitude: { degrees: 90, minutes: 0, seconds: 0, direction: 'N' },
  longitude: { degrees: 33, minutes: 13, seconds: 48, direction: 'E' },
}

/** Props for {@link DmsToDdForm}. */
export interface DmsToDdFormProps {
  /**
   * Called with the converted DD coordinate when the user
   * clicks "Add To Map" or "Update Marker".
   */
  onAddToMaps: (coordinate: DDCoordinate) => void
  /** When `true`, the submit button reads "Update Marker" instead of "Add To Map". */
  isEditing?: boolean
}

/**
 * Self-contained form for converting DMS → DD.
 *
 * Owns its own input state and conversion result. Calls `onAddToMaps`
 * with the resulting {@link DDCoordinate} when the user confirms.
 */
export function DmsToDdForm({ onAddToMaps, isEditing = false }: DmsToDdFormProps) {
  const [dmsInput, setDmsInput] = useState<DMSCoordinate>(DEFAULT_DMS)
  const [result, setResult] = useState<DDCoordinate | null>(null)

  const handleConvert = () => {
    setResult(dmsToDD(dmsInput))
  }

  const handleAddToMaps = () => {
    // If the user clicks Add before Convert, compute on the fly.
    const coordinate = result ?? dmsToDD(dmsInput)
    onAddToMaps(coordinate)
    setResult(null)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-600">
        Enter degrees, minutes &amp; seconds to get decimal degrees.
      </p>

      <DmsFieldGroup
        label="Latitude"
        value={dmsInput.latitude}
        direction={dmsInput.latitude.direction}
        directionOptions={['N', 'S']}
        onChange={(v) =>
          setDmsInput((prev) => ({ ...prev, latitude: { ...prev.latitude, ...v } }))
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
          setDmsInput((prev) => ({ ...prev, longitude: { ...prev.longitude, ...v } }))
        }
        onDirectionChange={(d) =>
          setDmsInput((prev) => ({
            ...prev,
            longitude: { ...prev.longitude, direction: d as 'E' | 'W' },
          }))
        }
      />

      <Button className="w-full" size="md" onClick={handleConvert}>
        Convert
      </Button>

      {result && (
        <div className="animate-fade-in space-y-3">
          <Separator label="Result" />
          <div className="space-y-2">
            <ResultRow label="Latitude" value={formatDD(result.latitude)} />
            <ResultRow label="Longitude" value={formatDD(result.longitude)} />
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
