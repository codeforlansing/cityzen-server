
const logError = require('../logging/log_error')
const express = require('express')

/**
 * The base type for tasks. Most <code>TaskProvider</code>s should return plain
 * old <code>Task</code>s, but some may use a subclass of this class to add additional provider specific functionality
 */
class Task {
  /**
   * Creates a new task with basic information attached to it
   *
   * @param { string } taskId             A provider specific string that uniquely identifies this task
   * @param { string } name               The name of the task
   * @param { string } description        A description of the task
   * @param {"todo" | "ready" | "done"} status The status of the task
   */
  constructor (taskId, name, description, status) {
    /** @public @readonly the id code for this task. This will be different between all providers. */
    this.taskId = taskId

    /** @public @readonly a human readable name for this task. This need not be unique. */
    this.name = name

    /** @public @readonly a human readable description for this task */
    this.description = description

    /** @public @readonly the status of this task.
     * "todo" denotes that a task is ready to be worked on,
     * "ready" that it is being worked on, and "
     * done" that it has been finished
     */
    this.status = status
  }
}

/**
 * A <code>TaskProvider</code> defines a source of tasks, such as a database,
 * a config file or a Trello board.
 *
 * @template {Task} T the tasks that this task provider returns.
 *  Some task providers may choose to extend this value and attach additional information to tasks.
 * @template C the configuration settings that this <code>TaskProvider</code> accepts
 */
class TaskProvider {
  /**
   * This function will be called inside ./src/config/tasks_provider_format.js
   * to provide configuration for the provider
   *
   * @returns { import("convict").Config<C> }
   */
  convictConfig () { return undefined }

  /**
   * Initialize to the provider service.
   * This function may not need to do anything, but it can be used to setup one time authentication
   * or to setup webhooks.
   *
   * Note that this function is marked as async, which means that you may use async calls when
   * performing the authentication flow.
   *
   * @param { C } config the provider configuration, as defined by convictConfig
   * @param { import("../config/index")["configData"] } appConfig the application configuration. See config/index.js for full schema
   * @returns { void | import("express").Router | PromiseLike<void | import("express").Router> } An express router which may be used to create provider specific endpoints for the api
   */
  init (config, appConfig) {
    return express.Router()
  }

  /**
   * Retrieve a listing of tasks from the service.
   *
   * This function does not accept any parameters.
   * If you want to configure its behaviour, you should configure the object that contains it instead.
   *
   * Note that this function is an async generator. This means that you may use asynchronous calls inside it.
   * Additionally, because it is a generator function, you use a yield statement instead of a return statement.
   * this is meant to accommodate APIs that paginate their results.
   *
   * TODO: do we want to allow passing queries, such as "tasks due within X days" here?
   * @returns { AsyncGenerator<T> | Generator<T> | AsyncIterable<T> | Iterable<T> }
   */
  getTasks () { return [] }
}

module.exports = TaskProvider
module.exports.Task = Task

/**
 *
 * @param {TaskProvider<Task, any>} TaskProvider a tasks provider
 * @param { import("../config/index").Config["tasks"] } tasksConfig the user provider configuration. See config/index.js for full schema
 * @param { import("../config/index").Config } config the application configuration. See config/index.js for full schema
 * @returns {Promise<express.Router>}
 */
async function mount (TaskProvider, tasksConfig, config) {
  const router = express.Router()
  router.use(express.json())

  // Add a route to handle the `GET /tasks` route.  This route responds with a
  // JSON array containing all the tasks that volunteers can work on.
  router.get('/', async (req, res) => {
    try {
      const tasksJson = []
      for await (const task of TaskProvider.getTasks()) {
        tasksJson.push(task)
      }
      res.json(tasksJson)
    } catch (error) {
      logError(error)
      res.status(503).json(error)
    }
  })

  if (TaskProvider) {
    const providerConfig = config.tasks.provider.provider.convictConfig()
    if (providerConfig) {
      providerConfig.load(config.tasks.provider.config)
    }

    const tasksRoute = await TaskProvider.init(
      providerConfig && providerConfig.getProperties(),
      config
    )

    if (tasksRoute) {
      router.use(config.tasks.provider.prefix, tasksRoute)
    }
  }

  return router
}

module.exports.mount = mount
