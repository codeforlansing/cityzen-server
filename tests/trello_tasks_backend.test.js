const TrelloTasksBackend = require('../src/trello_tasks_backend')
const nock = require('nock')

// @ts-ignore
const sampleTrelloCard = require('./samples/trello_card.json')

describe('Test handling requests to and from Trello', () => {
  test('Successfully get and translate tasks from Trello', async () => {
    const tasksBackend = new TrelloTasksBackend()
    const apiBaseUrl = 'https://api.trello.com/1'
    const listId = '5'
    const apiKey = 'yeKipa'
    const apiToken = 'nekpoTipa'
    const config = { apiBaseUrl, listId, apiKey, apiToken }

    const scope = nock('https://api.trello.com')
      .get(`/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
      .reply(200, [sampleTrelloCard])

    try {
      await tasksBackend.init(config)

      const tasks = []
      for await (const task of tasksBackend.getTasks()) {
        tasks.push(task)
      }

      expect(tasks.length).toBe(1)
      expect(tasks[0]).toEqual({
        taskId: '5cf705cfe9bb5d1d62d03375',
        name: 'Test Card',
        description: 'description of card',
        status: 'todo'
      })
    } finally {
      scope.done()
    }
  })

  test('Gracefully handles unexpected error from Trello', async () => {
    const tasksBackend = new TrelloTasksBackend()
    const apiBaseUrl = 'https://api.trello.com/1'
    const listId = '5'
    const apiKey = 'yeKipa'
    const apiToken = 'nekpoTipa'
    const config = { apiBaseUrl, listId, apiKey, apiToken }

    const scope = nock('https://api.trello.com')
      .get(`/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
      .reply(500)

    try {
      await tasksBackend.init(config)
      await expect(tasksBackend.getTasks().next()).rejects.toThrowError(
        'Trello cannot be reached for an unknown reason.'
      )
    } finally {
      scope.done()
    }
  })

  test('Gracefully handles Not Found error from Trello', async () => {
    const tasksBackend = new TrelloTasksBackend()
    const apiBaseUrl = 'https://api.trello.com/1'
    const listId = '5'
    const apiKey = 'yeKipa'
    const apiToken = 'nekpoTipa'
    const config = { apiBaseUrl, listId, apiKey, apiToken }

    const scope = nock('https://api.trello.com')
      .get(`/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
      .reply(404)

    try {
      await tasksBackend.init(config)
      await expect(tasksBackend.getTasks().next()).rejects.toThrowError(
        'Trello cannot be accessed. The server is likely misconfigured.'
      )
    } finally {
      scope.done()
    }
  })
})
