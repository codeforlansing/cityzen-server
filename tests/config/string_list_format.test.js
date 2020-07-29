const format = require('../../src/config/string_list_format')

describe('Test that string lists can be configured', () => {
  test('has name', () => {
    expect(format.name).toBe('string-list')
  })

  test('validate works', () => {
    // happy path
    expect(() => format.validate([])).not.toThrow()
    expect(() => format.validate(['a'])).not.toThrow()
    expect(() => format.validate(['a', 'b'])).not.toThrow()
    expect(() => format.validate(['a', 'b', 'c'])).not.toThrow()

    // rejects anything that's not a TaskProvider
    expect(() => format.validate()).toThrow()
    expect(() => format.validate({})).toThrow()
    expect(() => format.validate([1234])).toThrow()
    expect(() => format.validate(123)).toThrow()
    expect(() => format.validate(null)).toThrow()
    expect(() => format.validate(undefined)).toThrow()
  })

  test('coerce works', () => {
    // converts valid values
    expect(format.coerce('')).toEqual([])
    expect(format.coerce('a')).toEqual(['a'])
    expect(format.coerce('a,b')).toEqual(['a', 'b'])
    expect(format.coerce('a,b,c')).toEqual(['a', 'b', 'c'])

    // falsy values interpreted as empty array
    expect(format.coerce(null)).toEqual([])
    expect(format.coerce(undefined)).toEqual([])
    expect(format.coerce(false)).toEqual([])
    expect(format.coerce(0)).toEqual([])
  })
})
