const format = require('../../src/config/tasks_backend_format')
const TasksBackend = require('../../src/tasks_backend')

describe('Test that tasks backend can be configured', () => {
  test('has name', () => {
    expect(format.name).toBe('tasks-backend')
  })

  test('has values', () => {
    expect(format.values).toBeDefined()
    expect(Array.isArray(format.values)).toBeTruthy()
    expect(format.values.length).toBeGreaterThan(0)
  })

  test('validate works', () => {
    // happy path
    class FakeTasksBackend extends TasksBackend {}
    expect(() => format.validate(new TasksBackend())).not.toThrow()
    expect(() => format.validate(new FakeTasksBackend())).not.toThrow()

    // rejects anything that's not a TasksBackend
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
      expect(format.coerce(value)).toBeInstanceOf(TasksBackend)
    }

    // rejects any other values
    expect(() => format.coerce('fake')).toThrow()
    expect(() => format.coerce('TasksBackend')).toThrow()
  })
})
