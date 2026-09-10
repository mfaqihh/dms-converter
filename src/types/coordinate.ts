/**
 * Compass direction for a latitude value.
 */
export type LatDirection = 'N' | 'S'

/**
 * Compass direction for a longitude value.
 */
export type LonDirection = 'E' | 'W'

/**
 * A geographic coordinate expressed in DMS (Degrees, Minutes, Seconds) format.
 */
export interface DMSValue {
  degrees: number
  minutes: number
  seconds: number
}

/**
 * A full DMS coordinate pair (latitude + longitude), each with its own
 * degrees/minutes/seconds and compass direction.
 */
export interface DMSCoordinate {
  latitude: DMSValue & { direction: LatDirection }
  longitude: DMSValue & { direction: LonDirection }
}

/**
 * A geographic coordinate expressed in Decimal Degrees (DD) format.
 * Positive latitude = North, negative = South.
 * Positive longitude = East, negative = West.
 */
export interface DDCoordinate {
  latitude: number
  longitude: number
}

/**
 * A saved point/marker on the map, combining a DD coordinate with
 * metadata used to render and manage it.
 */
export interface MapPoint {
  id: string
  coordinate: DDCoordinate
  label?: string
}

/**
 * Which conversion direction the form is currently operating in.
 */
export type ConversionMode = 'DMS_TO_DD' | 'DD_TO_DMS'