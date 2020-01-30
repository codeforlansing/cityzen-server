const TasksBackend = require('./tasks_backend')

module.exports = {
  // this section is used to configure various things todo with tasks.
  // For now, it just sets up the backend, but in the future it may
  // contain additional configuration
  tasks: {
    backend: new TasksBackend()
  }
}
