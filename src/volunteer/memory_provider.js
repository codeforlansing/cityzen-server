const VolunteerProvider = require('.')

/**
 * Provides a in memory store of volunteer state. Note that this is not persistent, so if a the service restarts all state information stored will be lost.
 *
 * @extends { VolunteerProvider<{}> }
 */
class MemoryVolunteerProvider extends VolunteerProvider {
  constructor () {
    super()

    /**
     * @typedef {Object} VolunteerData
     * @property {string} username                        A backend specific string that uniquely identifies this task
     * @property {Set<string>} claimedTasks               The name of the task
     */

    /** @type { Map<string, VolunteerData> } */
    this.volunteers = new Map()
  }

  getVolunteer (username, create) {
    if (this.volunteers.has(username)) {
      return { username, claimedTasks: [...this.volunteers.get(username).claimedTasks.values()] }
    } else if (create) {
      const volunteer = { username, claimedTasks: new Set() }
      this.volunteers.set(username, volunteer)

      return { username, claimedTasks: [] }
    }
  }

  claimTask (username, taskId) {
    if (this.volunteers.has(username)) {
      this.volunteers.get(username).claimedTasks.add(username)
      return true
    } else {
      return false
    }
  }

  unclaimTask (username, taskId) {
    if (this.volunteers.has(username)) {
      this.volunteers.get(username).claimedTasks.delete(taskId)
      return true
    } else {
      return false
    }
  }

  * getClaimants (taskId) {
    for (const { username, claimedTasks } of this.volunteers.values()) {
      if (claimedTasks.has(taskId)) {
        yield { username, claimedTasks: [...claimedTasks.values()] }
      }
    }
  }
}

module.exports = MemoryVolunteerProvider
