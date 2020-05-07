const TaskProvider = require('.')
const express = require('express')

/**
 * An in-memory source of tasks that allows programmatically setting tasks
 * or using an internal HTTP route to upload tasks.
 *
 * @extends {TaskProvider<import('.').Task, {}>}
 */
class MemoryTaskProvider extends TaskProvider {
  constructor () {
    super()

    /** @type {import('.').Task[]} */
    this.tasks = []
  }

  /**
   * Initializes the in-memory provider service. An Express route is also
   * configured to allow an HTTP PUT to the `tasks.providerPrefix` endpoint
   * to replace the in-memory tasks with a new value. The body of this
   * request will look like:
   *
   * ``` json
   * [
   *   {
   *     "taskId": "998712e8127",
   *     "name": "New todo item",
   *     "description": "A longer description",
  *      "status": "todo"
   *   },
   *   ...
   * ]
   * ```
   *
   * @returns { import("express").Router } an Express router
   */
  init () {
    const router = express.Router()
    router.use(express.json())

    router.put('/', async (req, res) => {
      await this.setTasks(req.body)
      res.json(this.tasks)
    })

    return router
  }

  /**
   * Produces a sequence of tasks stored in memory.
   *
   * @returns a generator of saved tasks
   */
  async * getTasks () {
    for (const task of this.tasks) {
      yield task
    }
  }

  /**
   * A programmatic means of setting the in-memory tasks that this provider
   * will produce when `getTasks()` is called.
   *
   * @param {import(".").Task[]} tasks an array of tasks
   */
  async setTasks (tasks) {
    this.tasks = tasks || []
  }
}

module.exports = MemoryTaskProvider
