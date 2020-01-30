const TasksBackend = require('./tasks_backend')

module.exports = {
  // this section is used to configure various things todo with tasks.
  // For now, it just sets up the backend, but in the future it may
  // contain additional configuration
  tasks: {
    // the prefix used to get tasks, so for example
    // if you wanted to get a listing of all the tasks
    // the application knows about, it would be at /prefix
    prefix: '/tasks',
    // The prefix that the backend will be mounted at.
    // If backend.init() returns an express.Router(),
    // then it will be mounted at /tasks/backend.
    // This may be used for setting up backend specific endpoints
    // or Oauth callbacks, etc
    backendPrefix: '/tasks/backend',
    backend: new TasksBackend()
  }
}
