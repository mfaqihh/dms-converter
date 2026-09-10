import type {
  DDCoordinate,
  DMSCoordinate,
  DMSValue,
  LatDirection,
  LonDirection,
} from '../types/coordinate'

/**
 * Converts a single DMS (Degrees, Minutes, Seconds) value into a signed
 * decimal degree number, without applying hemisphere sign.
 *
 * Formula: decimal = degrees + (minutes / 60) + (seconds / 3600)
 *
 * @param dms - The degrees/minutes/seconds to convert.
 * @returns The unsigned decimal degree value.
 * @throws {Error} If minutes or seconds are outside the valid 0-59.999 range,
 *   or if degrees is negative (direction should be supplied separately).
 *
 * @example
 * dmsValueToDecimal({ degrees: 49, minutes: 30, seconds: 10 })
 * // => 49.502777...
 */
export function dmsValueToDecimal(dms: DMSValue): number {
  const { degrees, minutes, seconds } = dms

  if (degrees < 0) {
    throw new Error('degrees must be non-negative; use direction for sign')
  }
  if (minutes < 0 || minutes >= 60) {
    throw new Error('minutes must be between 0 and 59.999...')
  }
  if (seconds < 0 || seconds >= 60) {
    throw new Error('seconds must be between 0 and 59.999...')
  }

  return degrees + minutes / 60 + seconds / 3600
}

/**
 * Converts a full DMS coordinate (latitude + longitude, each with a
 * compass direction) into a Decimal Degrees (DD) coordinate.
 *
 * South and West directions produce negative decimal values.
 *
 * @param dms - The DMS coordinate to convert.
 * @returns The equivalent DD coordinate.
 *
 * @example
 * dmsToDD({
 *   latitude: { degrees: 49, minutes: 30, seconds: 10, direction: 'N' },
 *   longitude: { degrees: 123, minutes: 30, seconds: 20, direction: 'W' },
 * })
 * // => { latitude: 49.502778, longitude: -123.505556 }
 */
export function dmsToDD(dms: DMSCoordinate): DDCoordinate {
  const latDecimal = dmsValueToDecimal(dms.latitude)
  const lonDecimal = dmsValueToDecimal(dms.longitude)

  return {
    latitude: dms.latitude.direction === 'S' ? -latDecimal : latDecimal,
    longitude: dms.longitude.direction === 'W' ? -lonDecimal : lonDecimal,
  }
}

/**
 * Converts a single signed decimal degree value into a DMS (Degrees,
 * Minutes, Seconds) value plus its compass direction.
 *
 * @param decimal - The signed decimal degree value.
 * @param positiveDirection - Direction to use when the value is >= 0.
 * @param negativeDirection - Direction to use when the value is < 0.
 * @returns The DMS value including direction.
 *
 * @example
 * decimalValueToDMS(49.502778, 'N', 'S')
 * // => { degrees: 49, minutes: 30, seconds: 10, direction: 'N' }
 */
export function decimalValueToDMS<D extends string>(
  decimal: number,
  positiveDirection: D,
  negativeDirection: D,
): DMSValue & { direction: D } {
  const direction = decimal < 0 ? negativeDirection : positiveDirection
  const absolute = Math.abs(decimal)

  const degrees = Math.floor(absolute)
  const minutesFloat = (absolute - degrees) * 60
  const minutes = Math.floor(minutesFloat)
  const seconds = Math.round((minutesFloat - minutes) * 60 * 1000) / 1000

  // Handle rounding overflow (e.g. seconds rounding up to 60).
  if (seconds >= 60) {
    return {
      degrees,
      minutes: minutes + 1 === 60 ? 0 : minutes + 1,
      seconds: 0,
      direction,
    }
  }

  return { degrees, minutes, seconds, direction }
}

/**
 * Converts a Decimal Degrees (DD) coordinate into a full DMS coordinate.
 *
 * @param dd - The DD coordinate to convert.
 * @returns The equivalent DMS coordinate.
 *
 * @example
 * ddToDMS({ latitude: 49.502778, longitude: -123.505556 })
 * // => {
 * //   latitude: { degrees: 49, minutes: 30, seconds: 10, direction: 'N' },
 * //   longitude: { degrees: 123, minutes: 30, seconds: 20, direction: 'W' },
 * // }
 */
export function ddToDMS(dd: DDCoordinate): DMSCoordinate {
  return {
    latitude: decimalValueToDMS<LatDirection>(dd.latitude, 'N', 'S'),
    longitude: decimalValueToDMS<LonDirection>(dd.longitude, 'E', 'W'),
  }
}

/**
 * Formats a DD coordinate value for display, e.g. "49.502778 deg".
 *
 * @param value - The decimal degree value.
 * @param fractionDigits - Number of decimal places to show (default 6).
 */
export function formatDD(value: number, fractionDigits = 6): string {
  return `${value.toFixed(fractionDigits)} deg`
}

/**
 * Formats a DMS value with its direction for display,
 * e.g. `49° 30' 10" N`.
 *
 * @param value - The DMS value including direction.
 */
export function formatDMS(
  value: DMSValue & { direction: string },
): string {
  return `${value.degrees}\u00b0 ${value.minutes}' ${value.seconds}" ${value.direction}`
}