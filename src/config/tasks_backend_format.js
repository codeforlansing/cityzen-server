const TasksBackend = require('../tasks_backend')

const tasksBackend = {
  none: '../tasks_backend',
  memory: '../memory_tasks_backend',
  trello: '../trello_tasks_backend'
}

const values = Object.keys(tasksBackend)

module.exports = {
  name: 'tasks-backend',
  values,
  validate (val) {
    if (!(val instanceof TasksBackend)) {
      throw new Error('must be an instance of a TasksBackend class')
    }
  },
  coerce (val) {
    if (!val) {
      return new TasksBackend()
    }

    // See https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
    if (val.prototype instanceof TasksBackend || val === TasksBackend) {
      return val
    }

    if (typeof val !== 'string' || !values.includes(val)) {
      throw new Error(
        `${JSON.stringify(val, undefined, 2)} is not a valid tasks-backend format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const TasksBackendClass = require(tasksBackend[val])
    return new TasksBackendClass()
  }
}
