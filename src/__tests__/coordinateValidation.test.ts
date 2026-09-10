import {
  validateDDLatitude,
  validateDDLongitude,
  validateDDCoordinate,
  validateDMSLatitude,
  validateDMSLongitude,
  validateDMSCoordinate,
} from '../utils/coordinateValidation'

// ─── DD latitude ──────────────────────────────────────────────────────────

describe('validateDDLatitude', () => {
  it('accepts 0', () => {
    expect(validateDDLatitude(0)).toBeNull()
  })

  it('accepts boundary values −90 and 90', () => {
    expect(validateDDLatitude(-90)).toBeNull()
    expect(validateDDLatitude(90)).toBeNull()
  })

  it('rejects values above 90', () => {
    expect(validateDDLatitude(90.000001)).not.toBeNull()
    expect(validateDDLatitude(91)).not.toBeNull()
  })

  it('rejects values below −90', () => {
    expect(validateDDLatitude(-90.000001)).not.toBeNull()
    expect(validateDDLatitude(-91)).not.toBeNull()
  })
})

// ─── DD longitude ─────────────────────────────────────────────────────────

describe('validateDDLongitude', () => {
  it('accepts 0', () => {
    expect(validateDDLongitude(0)).toBeNull()
  })

  it('accepts boundary values −180 and 180', () => {
    expect(validateDDLongitude(-180)).toBeNull()
    expect(validateDDLongitude(180)).toBeNull()
  })

  it('rejects values above 180', () => {
    expect(validateDDLongitude(180.000001)).not.toBeNull()
    expect(validateDDLongitude(181)).not.toBeNull()
  })

  it('rejects values below −180', () => {
    expect(validateDDLongitude(-180.000001)).not.toBeNull()
    expect(validateDDLongitude(-181)).not.toBeNull()
  })
})

// ─── DD coordinate (combined) ─────────────────────────────────────────────

describe('validateDDCoordinate', () => {
  it('returns null for both axes when coordinate is valid', () => {
    const result = validateDDCoordinate({ latitude: 45, longitude: 90 })
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('reports only the invalid axis', () => {
    const result = validateDDCoordinate({ latitude: 91, longitude: 0 })
    expect(result.latitude).not.toBeNull()
    expect(result.longitude).toBeNull()
  })
})

// ─── DMS latitude ─────────────────────────────────────────────────────────

describe('validateDMSLatitude', () => {
  it('accepts 0° 0\' 0" N', () => {
    expect(
      validateDMSLatitude({ degrees: 0, minutes: 0, seconds: 0, direction: 'N' }),
    ).toBeNull()
  })

  it('accepts exactly 90° 0\' 0"', () => {
    expect(
      validateDMSLatitude({ degrees: 90, minutes: 0, seconds: 0, direction: 'N' }),
    ).toBeNull()
  })

  it('accepts a typical value', () => {
    expect(
      validateDMSLatitude({ degrees: 45, minutes: 30, seconds: 15, direction: 'S' }),
    ).toBeNull()
  })

  it('rejects degrees > 90', () => {
    expect(
      validateDMSLatitude({ degrees: 91, minutes: 0, seconds: 0, direction: 'N' }),
    ).not.toBeNull()
  })

  it('rejects minutes >= 60', () => {
    expect(
      validateDMSLatitude({ degrees: 45, minutes: 60, seconds: 0, direction: 'N' }),
    ).not.toBeNull()
  })

  it('rejects seconds >= 60', () => {
    expect(
      validateDMSLatitude({ degrees: 45, minutes: 0, seconds: 60, direction: 'N' }),
    ).not.toBeNull()
  })

  it('rejects pole edge case: 90° 0\' 1" (exceeds ±90°)', () => {
    expect(
      validateDMSLatitude({ degrees: 90, minutes: 0, seconds: 1, direction: 'N' }),
    ).not.toBeNull()
  })

  it('rejects pole edge case: 90° 1\' 0"', () => {
    expect(
      validateDMSLatitude({ degrees: 90, minutes: 1, seconds: 0, direction: 'N' }),
    ).not.toBeNull()
  })
})

// ─── DMS longitude ────────────────────────────────────────────────────────

describe('validateDMSLongitude', () => {
  it('accepts 0° 0\' 0" E', () => {
    expect(
      validateDMSLongitude({ degrees: 0, minutes: 0, seconds: 0, direction: 'E' }),
    ).toBeNull()
  })

  it('accepts exactly 180° 0\' 0"', () => {
    expect(
      validateDMSLongitude({ degrees: 180, minutes: 0, seconds: 0, direction: 'E' }),
    ).toBeNull()
  })

  it('accepts a typical value', () => {
    expect(
      validateDMSLongitude({ degrees: 120, minutes: 45, seconds: 30, direction: 'W' }),
    ).toBeNull()
  })

  it('rejects degrees > 180', () => {
    expect(
      validateDMSLongitude({ degrees: 181, minutes: 0, seconds: 0, direction: 'E' }),
    ).not.toBeNull()
  })

  it('rejects minutes >= 60', () => {
    expect(
      validateDMSLongitude({ degrees: 90, minutes: 60, seconds: 0, direction: 'E' }),
    ).not.toBeNull()
  })

  it('rejects seconds >= 60', () => {
    expect(
      validateDMSLongitude({ degrees: 90, minutes: 0, seconds: 60, direction: 'E' }),
    ).not.toBeNull()
  })

  it('rejects dateline edge case: 180° 0\' 1" (exceeds ±180°)', () => {
    expect(
      validateDMSLongitude({ degrees: 180, minutes: 0, seconds: 1, direction: 'E' }),
    ).not.toBeNull()
  })

  it('rejects dateline edge case: 180° 1\' 0"', () => {
    expect(
      validateDMSLongitude({ degrees: 180, minutes: 1, seconds: 0, direction: 'E' }),
    ).not.toBeNull()
  })
})

// ─── DMS coordinate (combined) ────────────────────────────────────────────

describe('validateDMSCoordinate', () => {
  it('returns null for both axes when coordinate is valid', () => {
    const result = validateDMSCoordinate({
      latitude: { degrees: 45, minutes: 30, seconds: 0, direction: 'N' },
      longitude: { degrees: 90, minutes: 0, seconds: 0, direction: 'E' },
    })
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('reports only the invalid axis', () => {
    const result = validateDMSCoordinate({
      latitude: { degrees: 91, minutes: 0, seconds: 0, direction: 'N' },
      longitude: { degrees: 90, minutes: 0, seconds: 0, direction: 'E' },
    })
    expect(result.latitude).not.toBeNull()
    expect(result.longitude).toBeNull()
  })
})
