
const express = require('express')
const helmet = require('helmet')
const UserProvider = require('./users')
const TaskProvider = require('./tasks')

/**
 * Builds the application, returning an express app that can be launched or used for testing.
 * Note that this function does not start the server itself. See ./index.js
 *
 * @param { ReturnType<import("./config")["loadConfig"]> } config the application configuration. See ./config/index.js for more information
 */
async function app (config) {
  // Instantiate an express server
  const app = express.Router()

  // Apply the 'helmet' middleware to our express application.  Helmet makes
  // sure that our HTTP headers are correctly configure for security and best
  // practices
  app.use(helmet())

  // Setup the routes (otherwise known as API endpoints, REST URLS, etc) for
  // our server.

  // This mounts the UserProvider abstraction.
  // By mounting it, we create API endpoints for interacting with users, and also initialize the configured UserProvider
  const userProvider = config.users.provider.provider
  app.use('/users/', await UserProvider.mount(userProvider, config.users, config))

  // Add a route to handle the `GET /tasks` route.  This route responds with a
  // JSON array containing all the tasks that volunteers can work on.
  const taskProvider = config.tasks.provider.provider
  app.use('/tasks/', await TaskProvider.mount(taskProvider, config.tasks, config))

  return express().use(config.server.prefix, app)
}

module.exports = app
