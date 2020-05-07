const superagent = require('superagent')
const convict = require('convict')
const TaskProvider = require('.')
const ServerError = require('../server_error')

/**
 * Uses Trello as the source of tasks for the provider.
 * @extends {TaskProvider<{ apiBaseUrl: string; apiKey: string; apiToken: string; listId: string; }>}
 */
class TrelloTaskProvider extends TaskProvider {
  convictConfig () {
    return convict({
      apiBaseUrl: {
        doc: `
        The base URL of the Trello API. Defaults to 'https://api.trello.com/1'.
      `,
        format: String,
        default: 'https://api.trello.com/1'
      },
      apiKey: {
        doc: `
        The key used to access Trello's REST API. Sign-in to Trello and visit
        https://trello.com/app-key to generate a key.
        Required if config.tasks.provider is 'trello'.
      `,
        format: String,
        default: '',
        env: 'TRELLO_API_KEY'
      },
      apiToken: {
        doc: `
        The token used to access Trello's REST API. Sign-in to Trello and visit
        https://trello.com/app-key, then click the Token link after generating
        a key to generate a token.
        Required if config.tasks.provider is 'trello'.
      `,
        format: String,
        default: '',
        env: 'TRELLO_API_TOKEN'
      },
      listId: {
        doc: `
        Trello's internal identifier for the list where tasks should be
        retrieved. Use the board ID and the list name to look up the list ID.
        Required if config.tasks.provider is 'trello'.
      `,
        format: String,
        default: '',
        env: 'TRELLO_LIST_ID'
      }
    })
  }

  /**
   * Initialize the provider service.
   *
   * @param { ReturnType<ReturnType<TrelloTaskProvider["convictConfig"]>["getProperties"]> } config the application configuration
   */
  async init (config) {
    this.config = config
  }

  /**
   * Retrieve a list of tasks from Trello.
   */
  async * getTasks () {
    try {
      const baseUrl = this.config.apiBaseUrl
      const key = this.config.apiKey
      const token = this.config.apiToken
      const listId = this.config.listId

      const requestUrl = `${baseUrl}/lists/${listId}/cards?key=${key}&token=${token}`
      const response = await superagent.get(requestUrl)

      for (const card of response.body) {
        yield {
          taskId: card.id,
          name: card.name,
          description: card.desc,
          /** @type {'todo'} */
          // @ts-ignore
          status: 'todo'
        }
      }
    } catch (error) {
      let message
      if (error.status >= 400 && error.status < 500) {
        message = 'Trello cannot be accessed. The server is likely misconfigured.'
      } else {
        message = 'Trello cannot be reached for an unknown reason.'
      }
      throw new ServerError(message, error)
    }
  }
}

module.exports = TrelloTaskProvider
