const supertest = require('supertest')
const app = require('../index')

describe('Test that the basic routes return dummy data', () => {
  test.skip('GET /tasks/', async () => {
    const { body } = await supertest(app)
      .get('/tasks/')
      .expect('Content-Type', '/json/')
      .expect(200)

    expect(body).toEqual({
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    })
  })

  test.skip('POST /tasks/volunteer', () => {
    return supertest(app)
      .post('/tasks/volunteer')
      .send({
        email: 'example@example.com',
        taskIds: ['uuid']
      })
      .expect(200)
  })
  test.todo('POST /user/report')
})
