const UserProvider = require('.')

class MemoryUser extends UserProvider.User {
  /**
   *
   * @param {string} userId The user id
   * @param {string[]} claimedTasks The tasks this user is claiming
   */
  constructor (userId, ...claimedTasks) {
    super(userId)
    this.claimedTasks = new Set(claimedTasks)
  }

  claimTasks (taskIds) {
    for (const taskId of taskIds) {
      this.claimedTasks.add(taskId)
    }
  }

  unclaimTasks (taskIds) {
    for (const taskId of taskIds) {
      this.claimedTasks.delete(taskId)
    }
  }

  doesClaimTask (taskId) {
    return this.claimedTasks.has(taskId)
  }
}

/**
 * Provides a in memory store of volunteer state. Note that this is not persistent, so if a the service restarts all state information stored will be lost.
 *
 * @extends { UserProvider<MemoryUser, {}> }
 */
class MemoryVolunteerProvider extends UserProvider {
  constructor () {
    super()

    /** @type { Map<string, MemoryUser> } */
    this.users = new Map()
  }

  /**
   * Adds a new user to this user provider
   * @param {string} userId The id of the user to add
   */
  addUser (userId) {
    const user = new MemoryUser(userId)
    this.users.set(userId, user)
    return user
  }

  getUser (userId) {
    if (this.users.has(userId)) {
      return this.users.get(userId)
    } else {
      return undefined
    }
  }
}

module.exports = Object.assign(MemoryVolunteerProvider, { User: MemoryUser })
