/**
 * Compass direction for a latitude value.
 * `'N'` = north (positive), `'S'` = south (negative).
 */
export type LatDirection = 'N' | 'S'

/**
 * Compass direction for a longitude value.
 * `'E'` = east (positive), `'W'` = west (negative).
 */
export type LonDirection = 'E' | 'W'

/**
 * A single axis value expressed in DMS (Degrees, Minutes, Seconds) format.
 * Direction is intentionally omitted here — it is added as an intersection
 * type where needed (e.g. {@link DMSCoordinate}).
 */
export interface DMSValue {
  degrees: number
  minutes: number
  seconds: number
}

/**
 * A full DMS coordinate pair for latitude and longitude, each
 * carrying its own compass direction.
 */
export interface DMSCoordinate {
  latitude: DMSValue & { direction: LatDirection }
  longitude: DMSValue & { direction: LonDirection }
}

/**
 * A geographic coordinate in Decimal Degrees (DD).
 * - Positive latitude  → North hemisphere
 * - Negative latitude  → South hemisphere
 * - Positive longitude → East of the prime meridian
 * - Negative longitude → West of the prime meridian
 */
export interface DDCoordinate {
  latitude: number
  longitude: number
}

/**
 * A saved marker on the map, linking a unique ID to a DD coordinate.
 * The optional `label` is reserved for future display use.
 */
export interface MapPoint {
  id: string
  coordinate: DDCoordinate
  label?: string
}

/** The active conversion direction of the form. */
export type ConversionMode = 'DMS_TO_DD' | 'DD_TO_DMS'