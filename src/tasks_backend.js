const express = require('express')

/**
 * @typedef {Object} Task
 * @property {string} taskId             A backend specific string that uniquely identifies this task
 * @property {string} name               The name of the task
 * @property {string} description        A description of the task
 * @property {"todo" | "ready" | "done"} status The status of the task
 */

/**
 * A <code>TasksBackend</code> defines a source of tasks, such as a database,
 * a config file or a Trello board.
 * @template C
 */
module.exports = class TasksBackend {
  /**
   * This function will be called inside ./src/config/tasks_backend_format.js
   * to provide configuration for the backend
   *
   * @returns { import("convict").Config<C> }
   */
  convictConfig () { return undefined }

  /**
   * Initialize to the backend service.
   * This function may not need to do anything, but it can be used to setup one time authentication
   * or to setup webhooks.
   *
   * Note that this function is marked as async, which means that you may use async calls when
   * performing the authentication flow.
   *
   * @param { C } config the backend configuration, as defined by convictConfig
   * @param { import("./config/index")["configData"] } appConfig the application configuration. See config/index.js for full schema
   * @returns { void | import("express").Router | PromiseLike<void | import("express").Router> } An express router which may be used to create backend specific endpoints for the api
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
   * ?: do we want to allow passing queries, such as "tasks due within X days" here?
   * @returns { AsyncGenerator<Task, void, unknown> }
   */
  async * getTasks () { }
}
