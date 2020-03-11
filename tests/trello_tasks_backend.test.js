const TrelloTasksBackend = require('../src/trello_tasks_backend')
const nock = require('nock')

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
      .reply(200, [
        {
          id: '5cf705cfe9bb5d1d62d03375',
          checkItemStates: null,
          closed: false,
          dateLastActivity: '2020-01-30T00:21:30.911Z',
          desc: 'description of card',
          descData: null,
          dueReminder: null,
          idBoard: '3edf95f8d06c1bbb2b638886',
          idList: '028b261023807ede7dbb9de8',
          idMembersVoted: [],
          idShort: 2,
          idAttachmentCover: null,
          idLabels: [],
          manualCoverAttachment: false,
          name: 'Test Card',
          pos: 98303.5,
          shortLink: 'f01ad573',
          isTemplate: false,
          badges: {
            attachmentsByType: {
              trello: {
                board: 0,
                card: 0
              }
            },
            location: false,
            votes: 0,
            viewingMemberVoted: false,
            subscribed: true,
            dueComplete: false,
            due: null,
            description: false,
            attachments: 0,
            comments: 1,
            checkItemsChecked: 0,
            checkItems: 0,
            fogbugz: '',
            checkItemsEarliestDue: null
          },
          dueComplete: false,
          due: null,
          idChecklists: [],
          idMembers: [],
          labels: [],
          shortUrl: 'https://trello.com/c/f01ad573',
          subscribed: true,
          url: 'https://trello.com/c/f01ad573/testboardname',
          cover: {
            idAttachment: null,
            color: null,
            idUploadedBackground: null,
            size: 'normal',
            brightness: 'light'
          }
        }
      ])

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
