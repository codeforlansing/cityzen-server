const format = require('../../src/config/task_provider_format')
const TaskProvider = require('../../src/tasks')

describe('Test that tasks provider can be configured', () => {
  test('has name', () => {
    expect(format.name).toBe('tasks-provider')
  })

  test('has values', () => {
    expect(format.values).toBeDefined()
    expect(Array.isArray(format.values)).toBeTruthy()
    expect(format.values.length).toBeGreaterThan(0)
  })

  test('validate works', () => {
    // happy path
    class FakeTaskProvider extends TaskProvider {}
    expect(() => format.validate(new TaskProvider())).not.toThrow()
    expect(() => format.validate(new FakeTaskProvider())).not.toThrow()

    // rejects anything that's not a TaskProvider
    expect(() => format.validate()).toThrow()
    expect(() => format.validate({})).toThrow()
    expect(() => format.validate([])).toThrow()
    expect(() => format.validate(123)).toThrow()
    expect(() => format.validate(null)).toThrow()
    expect(() => format.validate('none')).toThrow()
  })

  test('coerce works', () => {
    // converts valid values
    for (const value of format.values) {
      expect(format.coerce(value)).toBeInstanceOf(TaskProvider)
    }

    // rejects any other values
    expect(() => format.coerce('fake')).toThrow()
    expect(() => format.coerce('TaskProvider')).toThrow()
  })
})
