import {
  ddToDMS,
  dmsToDD,
  dmsValueToDecimal,
  formatDD,
  formatDMS,
} from '../utils/coordinateConversion'

describe('dmsValueToDecimal', () => {
  it('converts a basic DMS value to decimal', () => {
    expect(dmsValueToDecimal({ degrees: 49, minutes: 30, seconds: 10 })).toBeCloseTo(
      49.502778,
      5,
    )
  })

  it('throws when minutes are out of range', () => {
    expect(() =>
      dmsValueToDecimal({ degrees: 10, minutes: 60, seconds: 0 }),
    ).toThrow()
  })

  it('throws when seconds are out of range', () => {
    expect(() =>
      dmsValueToDecimal({ degrees: 10, minutes: 0, seconds: 60 }),
    ).toThrow()
  })
})

describe('dmsToDD', () => {
  it('converts a Northern/Western DMS coordinate to signed decimal degrees', () => {
    const result = dmsToDD({
      latitude: { degrees: 49, minutes: 30, seconds: 10, direction: 'N' },
      longitude: { degrees: 123, minutes: 30, seconds: 20, direction: 'W' },
    })

    expect(result.latitude).toBeCloseTo(49.502778, 5)
    expect(result.longitude).toBeCloseTo(-123.505556, 5)
  })

  it('produces positive values for East and North', () => {
    const result = dmsToDD({
      latitude: { degrees: 10, minutes: 0, seconds: 0, direction: 'N' },
      longitude: { degrees: 20, minutes: 0, seconds: 0, direction: 'E' },
    })

    expect(result.latitude).toBe(10)
    expect(result.longitude).toBe(20)
  })
})

describe('ddToDMS', () => {
  it('converts a signed decimal coordinate back into DMS with direction', () => {
    const result = ddToDMS({ latitude: 49.502778, longitude: -123.505556 })

    expect(result.latitude.direction).toBe('N')
    expect(result.latitude.degrees).toBe(49)
    expect(result.latitude.minutes).toBe(30)
    expect(result.latitude.seconds).toBeCloseTo(10, 0)

    expect(result.longitude.direction).toBe('W')
    expect(result.longitude.degrees).toBe(123)
    expect(result.longitude.minutes).toBe(30)
    expect(result.longitude.seconds).toBeCloseTo(20, 0)
  })

  it('round-trips through dmsToDD without meaningful drift', () => {
    const original = { latitude: 90, longitude: 33.23 }
    const roundTripped = dmsToDD(ddToDMS(original))

    expect(roundTripped.latitude).toBeCloseTo(original.latitude, 3)
    expect(roundTripped.longitude).toBeCloseTo(original.longitude, 3)
  })
})

describe('formatting helpers', () => {
  it('formats decimal degrees with the "deg" suffix', () => {
    expect(formatDD(90)).toBe('90.000000 deg')
  })

  it('formats DMS values with the degree/minute/second symbols', () => {
    expect(
      formatDMS({ degrees: 90, minutes: 0, seconds: 0, direction: 'N' }),
    ).toBe(`90\u00b0 0' 0" N`)
  })
})