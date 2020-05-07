const format = require('../../src/config/root_relative_path_format')

describe('Test that root-relative paths can be configured', () => {
  test('has name', () => {
    expect(format.name).toBe('root-relative-path')
  })

  test('validate works', () => {
    // happy paths
    expect(() => format.validate('/')).not.toThrow()
    expect(() => format.validate('/tasks')).not.toThrow()
    expect(() => format.validate('/tasks/')).not.toThrow()
    expect(() => format.validate('/tasks/provider')).not.toThrow()

    // bad paths, not allowed
    expect(() => format.validate('https://www.google.com')).toThrow()
    expect(() => format.validate('relative-path')).toThrow()
    expect(() => format.validate('/path?query=param')).toThrow()
    expect(() => format.validate('/path?query=param&part=two')).toThrow()
  })
})
