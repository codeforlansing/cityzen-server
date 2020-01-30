const TasksBackend = require('../src/tasks_backend')

class TestTasksBackend extends TasksBackend {
  constructor (tasks) {
    super()

    this.tasks = tasks
  }

  async init (config) {
    const router = await super.init(config)

    router.get('/', (req, res) => {
      res.json({ msg: 'testing backend ok' })
    })

    return router
  }

  async * getTasks () {
    for (const task of this.tasks) {
      yield task
    }
  }
}

module.exports = {
  TestTasksBackend
}
