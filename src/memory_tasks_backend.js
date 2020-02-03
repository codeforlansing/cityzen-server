var express = require('express')
const TasksBackend = require('./tasks_backend')

module.exports = class MemoryTasksBackend extends TasksBackend {
  constructor () {
    super()
    this.tasks = []
  }

  async init (config) {
    const router = await super.init(config)
    router.use(express.json())

    router.put('/', async (req, res) => {
      await this.setTasks(req.body)
      res.json(this.tasks)
    })

    return router
  }

  async * getTasks () {
    for (const task of this.tasks) {
      yield task
    }
  }

  async setTasks (tasks) {
    this.tasks = tasks || []
  }
}
