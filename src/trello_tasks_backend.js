const superagent = require('superagent')
const TasksBackend = require('./tasks_backend')

const TRELLO_API = 'https://api.trello.com/1'

/**
 * Uses Trello as the source of tasks for the backend.
 */
module.exports = class TrelloTasksBackend extends TasksBackend {
  /**
   * Initialize the backend service.
   *
   * @param {object} config the application configuration
   */
  async init (config) {
    this.config = config
  }

  /**
   * Retrieve a list of tasks from Trello.
   */
  async * getTasks () {
    const key = this.config.tasks.trelloApiKey
    const token = this.config.tasks.trelloApiToken
    const listId = this.config.tasks.trelloListId

    const response = await superagent
      .get(`${TRELLO_API}/lists/${listId}/cards?key=${key}&token=${token}`)

    for (const card of response.body) {
      yield {
        taskId: card.id,
        name: card.name,
        description: card.desc,
        status: 'todo'
      }
    }
  }
}
