import { useState } from 'react'
import type { DDCoordinate, MapPoint } from '../types/coordinate'

/** Return type of {@link useMapPoints}. */
interface UseMapPointsReturn {
  /** All currently saved map points. */
  points: MapPoint[]
  /** Adds a new point at the given coordinate. Returns its generated id. */
  addPoint: (coordinate: DDCoordinate) => string
  /** Updates the coordinate of an existing point identified by id. */
  updatePoint: (id: string, coordinate: DDCoordinate) => void
}

/**
 * Manages the list of saved {@link MapPoint} markers: adding new
 * points and updating an existing point's coordinate in place.
 */
export function useMapPoints(): UseMapPointsReturn {
  const [points, setPoints] = useState<MapPoint[]>([])

  /**
   * Adds a new point at the given coordinate and returns its id.
   */
  const addPoint = (coordinate: DDCoordinate): string => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `point-${Date.now()}-${Math.random().toString(16).slice(2)}`

    setPoints((prev) => [...prev, { id, coordinate }])
    return id
  }

  /**
   * Updates the coordinate of an existing point by id.
   */
  const updatePoint = (id: string, coordinate: DDCoordinate) => {
    setPoints((prev) =>
      prev.map((point) => (point.id === id ? { ...point, coordinate } : point)),
    )
  }

  return { points, addPoint, updatePoint }
}