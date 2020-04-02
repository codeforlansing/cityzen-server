/**
 * @typedef {Object} Volunteer
 * @property {string} username             A backend specific string that uniquely identifies this task
 * @property {string[]} claimedTasks               The name of the task
 */

/**
 * An abstract class which describes a way to store an retrieve information about `Volunteer`s.
 *
 * @template C
 */
module.exports = class VolunteerProvider {
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
   * @param { import("../config/index")["loadConfig"] } appConfig the application configuration. See config/index.js for full schema
   * @returns { void | import("express").Router | PromiseLike<void | import("express").Router> } An express router which may be used to create backend specific endpoints for the api
   */
  init (config, appConfig) { }

  /**
   * Fetches a volunteer from the remote given its id.
   *
   * @param {string} username - The id of the volunteer to get.
   * @param {boolean=} create - If no user with the given username exists and create is true, then attempt to create a new user with that username
   * @returns {PromiseLike<Volunteer> | Volunteer }
   */
  getVolunteer (username, create) { return undefined }

  /**
   * Specify that the given volunteer would like to work on the given task.
   * This is not expected to check if the taskId belongs to a valid task.
   *
   * If the given volunteer does not exist, then this should return false. Otherwise it should return true
   *
   * @param { string  } username - The username of the volunteer who should claim the given task id.
   * @param {string} taskId - The taskId of the task which will be claimed by this volunteer.
   * @returns { PromiseLike<boolean> | boolean }
   */
  claimTask (username, taskId) { return false }

  /**
   * Specify that the given volunteer would like to stop working on the given task.
   * This is not expected to check if the taskId belongs to a valid task.
   *
   * If the volunteer is not already working on the given task, then this should succeeded silently
   *
   * If the given volunteer does not exist, then this should return false. Otherwise it should return true
   *
   * @param { string  } username - The username of the volunteer who wants to stop working on the given task id.
   * @param {string} taskId - The taskId of the task which will be unclaimed by this volunteer.
   * @returns { PromiseLike<boolean> | boolean }
   */
  unclaimTask (username, taskId) { return false }

  /**
   * Fetches all the volunteers who have claimed this task id.
   *
   * @param {string} taskId - The task id we want to query against
   * @returns { AsyncGenerator<Volunteer> | Generator<Volunteer> | AsyncIterable<Volunteer> | Iterable<Volunteer> }
   */
  getClaimants (taskId) { return [] }
}
