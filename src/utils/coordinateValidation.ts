import type {
  DDCoordinate,
  DMSCoordinate,
  DMSValue,
  LatDirection,
  LonDirection,
} from '../types/coordinate'

/**
 * Per-axis validation result.
 * `null` means the value is valid; a string contains the human-readable error.
 */
export interface AxisValidation {
  latitude: string | null
  longitude: string | null
}

// ─── DD validators ────────────────────────────────────────────────────────

/**
 * Validates a single DD latitude value.
 * @returns `null` if valid, or an error message string.
 */
export function validateDDLatitude(value: number): string | null {
  if (value < -90 || value > 90) {
    return 'Latitude must be between −90° and 90°.'
  }
  return null
}

/**
 * Validates a single DD longitude value.
 * @returns `null` if valid, or an error message string.
 */
export function validateDDLongitude(value: number): string | null {
  if (value < -180 || value > 180) {
    return 'Longitude must be between −180° and 180°.'
  }
  return null
}

/**
 * Validates a full DD coordinate and returns errors for each axis.
 *
 * @example
 * validateDDCoordinate({ latitude: 91, longitude: 0 })
 * // => { latitude: 'Latitude must be between −90° and 90°.', longitude: null }
 */
export function validateDDCoordinate(coordinate: DDCoordinate): AxisValidation {
  return {
    latitude: validateDDLatitude(coordinate.latitude),
    longitude: validateDDLongitude(coordinate.longitude),
  }
}

// ─── DMS validators ───────────────────────────────────────────────────────

/**
 * Validates a DMS latitude value.
 *
 * Rules:
 * - Degrees must be 0–90.
 * - Minutes must be 0–59.999.
 * - Seconds must be 0–59.999.
 * - At exactly 90°, both minutes and seconds must be 0 (pole limit).
 *
 * @returns `null` if valid, or an error message string.
 */
export function validateDMSLatitude(
  value: DMSValue & { direction: LatDirection },
): string | null {
  if (value.degrees < 0 || value.degrees > 90) {
    return 'Latitude degrees must be between 0 and 90.'
  }
  if (value.minutes < 0 || value.minutes >= 60) {
    return 'Minutes must be between 0 and 59.999.'
  }
  if (value.seconds < 0 || value.seconds >= 60) {
    return 'Seconds must be between 0 and 59.999.'
  }
  // Pole edge case: 90° 0' 1" would exceed ±90°.
  if (value.degrees === 90 && (value.minutes > 0 || value.seconds > 0)) {
    return 'At 90°, minutes and seconds must both be 0.'
  }
  return null
}

/**
 * Validates a DMS longitude value.
 *
 * Rules:
 * - Degrees must be 0–180.
 * - Minutes must be 0–59.999.
 * - Seconds must be 0–59.999.
 * - At exactly 180°, both minutes and seconds must be 0 (dateline limit).
 *
 * @returns `null` if valid, or an error message string.
 */
export function validateDMSLongitude(
  value: DMSValue & { direction: LonDirection },
): string | null {
  if (value.degrees < 0 || value.degrees > 180) {
    return 'Longitude degrees must be between 0 and 180.'
  }
  if (value.minutes < 0 || value.minutes >= 60) {
    return 'Minutes must be between 0 and 59.999.'
  }
  if (value.seconds < 0 || value.seconds >= 60) {
    return 'Seconds must be between 0 and 59.999.'
  }
  // Dateline edge case: 180° 0' 1" would exceed ±180°.
  if (value.degrees === 180 && (value.minutes > 0 || value.seconds > 0)) {
    return 'At 180°, minutes and seconds must both be 0.'
  }
  return null
}

/**
 * Validates a full DMS coordinate and returns errors for each axis.
 */
export function validateDMSCoordinate(coordinate: DMSCoordinate): AxisValidation {
  return {
    latitude: validateDMSLatitude(coordinate.latitude),
    longitude: validateDMSLongitude(coordinate.longitude),
  }
}
