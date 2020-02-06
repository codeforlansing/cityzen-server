const express = require('express')

/**
 * A <code>TasksBackend</code> defines a source of tasks, such as a database,
 * a config file or a Trello board.
 */
module.exports = class TasksBackend {
  /**
   * Initialize to the backend service.
   * This function may not need to do anything, but it can be used to setup one time authentication
   * or to setup webhooks.
   *
   * Note that this function is marked as async, which means that you may use async calls when
   * performing the authentication flow.
   *
   * @param {object} config the application configuration. See config/index.js for full schema
   */
  async init (config) {
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
   */
  async * getTasks () { }
}
