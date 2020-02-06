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
    const TasksBackend = require('../tasks_backend')
    if (!(val instanceof TasksBackend)) {
      throw new Error('must be an instance of a TasksBackend class')
    }
  },
  coerce (val) {
    if (!values.includes(val)) {
      throw new Error(
        `'${val}' is not a valid tasks-backend format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const TasksBackendClass = require(tasksBackend[val])
    return new TasksBackendClass()
  }
}
