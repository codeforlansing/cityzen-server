const express = require('express')
const logError = require('../logging/log_error')

class User {
  /**
    * Make a new user with the given id
    * @param {string} id
    */
  constructor (id) {
    /**
     * The userId for this user. This should be unique between all users, and can be used to fetch this user form the UserProvider
     */
    this.id = id
  }

  /**
  * Specify that the given user would like to work on the given tasks.
  * This is not expected to check if the taskId belongs to a valid tasks.
  *
  *
  * @param {string[]} taskIds - The ids of the task which will be claimed by this user.
   * @returns { PromiseLike<void> | void }
  * @abstract
  */
  claimTasks (taskIds) { throw new Error('unimplemented') }
}

/**
 * An abstract class which describes a way to store an retrieve information about `user`s.
 *
 * @template {User} U the type of user provided by this UserProvider
 * @template C a type describing the configuration object this user provider will create from its `convictConfig` function
 */
class UserProvider {
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
   * @param { import("../config/index").Config } appConfig the application configuration. See config/index.js for full schema
   * @returns { void | import("express").Router | PromiseLike<void | import("express").Router> } An express router which may be used to create backend specific endpoints for the api
   */
  init (config, appConfig) { }

  /**
   * Fetches a user from the remote given their id. If no such user exists, return undefined.
   *
   * @param {string} userId - The id of the user to get.
   * @returns {PromiseLike<U | undefined> | U | undefined }
   */
  getUser (userId) { throw new Error('unimplemented') }
}

/**
 *
 * @param {UserProvider<User, any>} userProvider a user provider
 * @param { import("../config/index").Config["users"] } providerConfig the user provider configuration. See config/index.js for full schema
 * @param { import("../config/index").Config } config the application configuration. See config/index.js for full schema
 * @returns {Promise<express.Router>}
 */
async function mount (userProvider, providerConfig, config) {
  const router = express.Router()
  router.use(express.json())

  // Route to handle `POST /users/:id/tasks/claim`.  This route is called when a
  // user wants to user for a task.  It does not return any data, but
  // should send a 201 HTTP status code to indicate that everything went OK.
  router.post('/:id/tasks/claim', async (req, res) => {
    try {
      const { id } = req.params
      const { tasks } = req.body

      const user = await userProvider.getUser(id)

      if (user) {
        await user.claimTasks(tasks)
        // Everything is OK.
        res.status(201).end()
      } else {
        res.status(404).end()
      }
    } catch (error) {
      logError(error)
      res.status(500).json(error)
    }
  })

  // Route to handle `GET /users/:id/`.
  router.get('/:id/', async (req, res) => {
    try {
      const { id } = req.params

      const user = await userProvider.getUser(id)

      if (user) {
        res.json({ id: user.id })
      } else {
        res.status(404).end()
      }
    } catch (error) {
      logError(error)
      res.status(500).json(error)
    }
  })

  if (userProvider) {
    const userProviderConfig = userProvider.convictConfig()
    if (userProviderConfig) {
      userProviderConfig.load(providerConfig.provider.config)
    }

    const userProviderRoute = await userProvider.init(userProviderConfig && userProviderConfig.getProperties(), config)
    if (userProviderRoute) {
      router.use(providerConfig.provider.prefix, userProviderRoute)
    }
  }

  return router
}

module.exports = Object.assign(UserProvider, { mount, User })
