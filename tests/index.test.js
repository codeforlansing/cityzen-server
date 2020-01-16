const supertest = require('supertest')
const app = require('../src/app')

const DEFAULT_TEST_CONFIG = {}

describe('Test that the basic routes return dummy data', () => {
  test('GET /tasks/', async () => {
    const { body } = await supertest(app(DEFAULT_TEST_CONFIG))
      .get('/tasks/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  })

  test('POST /tasks/volunteer', () => {
    return supertest(app(DEFAULT_TEST_CONFIG))
      .post('/tasks/volunteer')
      .send({
        email: 'example@example.com',
        taskIds: ['uuid']
      })
      .expect(201)
  })

  test.todo('POST /user/report')
})
