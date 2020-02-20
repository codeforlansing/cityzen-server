const supertest = require('supertest')
const app = require('../src/app')
const { loadConfig } = require('../src/config')
const TrelloTasksBackend = require('../src/trello_tasks_backend')
const nock = require('nock')

describe('Test Handling Requests to and from Trello', () => {
  // Jest doesn't pass command line arguments through to tests:
  // https://github.com/facebook/jest/issues/5089
  // For now, override the backend config manually.
  const backend = new TrelloTasksBackend()
  const config = loadConfig()
  config.tasks.backend.backend = backend
  const listId = 5
  const apiKey = 'yeKipa'
  const apiToken = 'nekpoTipa'
  const trelloConfig = {
    listId,
    apiKey,
    apiToken
  }

  Object.assign(config.tasks.backend.config, trelloConfig)

  // test getting tasks
  test('GET /tasks/', async () => {
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

    const { body } = await supertest(await app(config))
      .get('/tasks/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: '5cf705cfe9bb5d1d62d03375',
      name: 'Test Card',
      description: 'description of card',
      status: 'todo'
    }])

    scope.done()
  })

  test('GET /tasks/ 500', async () => {
    const scope = nock('https://api.trello.com')
      .get(`/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
      .reply(500)

    const { body } = await supertest(await app(config))
      .get('/tasks/')
      .expect(503)

    expect(body.originalStatus).toBe(500)
    expect(body.message).toBe('Unexpected Response')

    scope.done()
  })
  test('GET /tasks/ 404', async () => {
    const scope = nock('https://api.trello.com')
      .get(`/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`)
      .reply(404)

    const { body } = await supertest(await app(config))
      .get('/tasks/')
      .expect(503)

    expect(body.originalStatus).toBe(404)
    expect(body.message).toBe('Misconfigured')

    scope.done()
  })
})
