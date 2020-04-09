
const express = require('express')
const helmet = require('helmet')
const logError = require('./logging/log_error')
const UserProvider = require('./users')

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
  const volunteerProvider = config.users.provider.provider
  app.use('/users/', await UserProvider.mount(volunteerProvider, config.users, config))

  const tasksBackend = config.tasks.backend.backend

  // Add a route to handle the `GET /tasks` route.  This route responds with a
  // JSON array containing all the tasks that volunteers can work on.
  app.get('/tasks/', async (req, res) => {
    try {
      const tasksJson = []
      for await (const task of tasksBackend.getTasks()) {
        tasksJson.push(task)
      }
      res.json(tasksJson)
    } catch (error) {
      logError(error)
      res.status(503).json(error)
    }
  })

  if (tasksBackend) {
    const backendConfig = config.tasks.backend.backend.convictConfig()
    if (backendConfig) {
      backendConfig.load(config.tasks.backend.config)
    }

    const tasksRoute = await tasksBackend.init(
      backendConfig && backendConfig.getProperties(),
      config
    )

    if (tasksRoute) {
      app.use(config.tasks.backend.prefix, tasksRoute)
    }
  }

  return express().use(config.server.prefix, app)
}

module.exports = app
